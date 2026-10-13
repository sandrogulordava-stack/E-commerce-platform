import { describe, it, expect } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoritesModule from '../src/components/student4';
import { renderInStore } from './helpers';

describe('სტუდენტი 4 — რჩეულები', () => {
  it('ალაგებს, ეძებს, გადააქვს კალათაში და შლის', async () => {
    localStorage.setItem('tech-store-favorites-v1', '[1,4]');
    const user = userEvent.setup();
    renderInStore(<FavoritesModule />);
    expect(screen.getByRole('searchbox', { name: 'რჩეულებში ძებნა' })).toHaveFocus();
    await user.selectOptions(screen.getByLabelText('დალაგება'), 'price-asc');
    expect(within(screen.getAllByRole('article')[0]).getByText('უსადენო მაუსი')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'ყურსასმენი');
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1));
    await user.click(screen.getByRole('button', { name: 'კალათაში გადატანა' }));
    expect(JSON.parse(localStorage.getItem('tech-store-cart-v1'))).toEqual([{ productId: 1, quantity: 1 }]);
    expect(JSON.parse(localStorage.getItem('tech-store-favorites-v1'))).toEqual([4]);
    await user.click(screen.getByRole('button', { name: 'ძებნის გასუფთავება' }));
    await screen.findByText('უსადენო მაუსი');
    await user.click(screen.getByRole('button', { name: 'უსადენო მაუსი: რჩეულებიდან წაშლა' }));
    expect(screen.getByText(/რჩეულების სია ცარიელია/)).toBeInTheDocument();
  });

  it('არ კარგავს რჩეულ პროდუქტს, როცა კალათაში მაქსიმალური რაოდენობაა', async () => {
    localStorage.setItem('tech-store-favorites-v1', '[1]');
    localStorage.setItem('tech-store-cart-v1', '[{"productId":1,"quantity":12}]');
    const user = userEvent.setup();
    renderInStore(<FavoritesModule />);
    await user.click(screen.getByRole('button', { name: 'კალათაში გადატანა' }));
    expect(screen.getByText(/პროდუქტი რჩეულებში დარჩა/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('tech-store-favorites-v1'))).toEqual([1]);
  });
});
