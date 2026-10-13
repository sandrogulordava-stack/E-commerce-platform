import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatalogModule from '../src/components/student1';
import { renderInStore } from './helpers';

describe('სტუდენტი 1 — კატალოგი', () => {
  it('ტვირთავს მონაცემებს StrictMode-ში, ფოკუსირდება, ეძებს დაყოვნებით და ასუფთავებს', async () => {
    const user = userEvent.setup();
    renderInStore(<CatalogModule />);
    const search = screen.getByRole('searchbox', { name: 'პროდუქტის ძებნა' });
    expect(search).toHaveFocus();
    expect(screen.getByText('იტვირთება პროდუქტები...')).toBeInTheDocument();
    await screen.findByText('ნაპოვნია 8 პროდუქტი');
    await user.type(search, 'ყურსასმენი');
    await screen.findByText('ნაპოვნია 1 პროდუქტი');
    await user.selectOptions(screen.getByLabelText('კატეგორია'), 'დამტენები');
    expect(screen.getByText(/პროდუქტი ვერ მოიძებნა/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ფილტრების გასუფთავება' }));
    await screen.findByText('ნაპოვნია 8 პროდუქტი');
    expect(search).toHaveFocus();
    await user.click(screen.getAllByRole('button', { name: 'კალათაში დამატება' })[0]);
    await waitFor(() => expect(JSON.parse(localStorage.getItem('tech-store-cart-v1'))).toEqual([{ productId: 1, quantity: 1 }]));
    await user.click(screen.getByRole('button', { name: 'უსადენო ყურსასმენი: რჩეულებში დამატება' }));
    expect(screen.getByRole('button', { name: 'უსადენო ყურსასმენი: რჩეულებიდან წაშლა' })).toHaveAttribute('aria-pressed', 'true');
  });
});
