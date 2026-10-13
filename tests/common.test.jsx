import { useContext } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';
import Header from '../src/components/shared/Header';
import { StoreContext } from '../src/context/StoreContext';
import { readStoredValue, isCart, isFavorites } from '../src/utils/storage';
import { productType } from '../src/utils/propTypes';
import { renderInStore } from './helpers';

function StateView() {
  const { cart, favoriteIds } = useContext(StoreContext);
  return <p>{`კალათა ${cart.length}; რჩეული ${favoriteIds.length}`}</p>;
}

describe('საერთო ინფრასტრუქტურა', () => {
  it('დაზიანებული შენახული მონაცემებისას უსაფრთხოდ იწყებს ცარიელი მდგომარეობით', () => {
    localStorage.setItem('tech-store-cart-v1', '{bad-json');
    localStorage.setItem('tech-store-favorites-v1', '[999]');
    renderInStore(<StateView />);
    expect(screen.getByText('კალათა 0; რჩეული 0')).toBeInTheDocument();
    expect(isCart([{ productId: 1, quantity: 99 }])).toBe(false);
    expect(isCart([{ productId: 1, quantity: 1 }, { productId: 1, quantity: 2 }])).toBe(false);
    expect(isFavorites([1, 1])).toBe(false);
    expect(readStoredValue('არარსებული', [])).toEqual([]);
  });

  it('შენახვის დაბლოკვისას აპლიკაცია მუშაობას აგრძელებს', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('კვოტა', 'QuotaExceededError'); });
    const user = userEvent.setup();
    renderInStore(<><Header /><StateView /></>);
    await user.click(screen.getByText('პროდუქტის სწრაფი არჩევა'));
    await user.click(screen.getByRole('button', { name: 'კალათაში დამატება' }));
    expect(screen.getByText('კალათა 1; რჩეული 0')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('ბრაუზერში შენახვა მიუწვდომელია');
  });

  it('PropTypes რეალურად აფიქსირებს არასწორ props-ს', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    PropTypes.resetWarningCache();
    PropTypes.checkPropTypes({ product: productType.isRequired }, { product: { id: 'არასწორი' } }, 'prop', 'სატესტო ბარათი');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
