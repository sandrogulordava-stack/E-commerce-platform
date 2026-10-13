import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartModule from '../src/components/student2';
import { renderInStore } from './helpers';

describe('სტუდენტი 2 — კალათა', () => {
  it('აღადგენს კალათას, ცვლის რაოდენობას, ამოწმებს კუპონს და ასრულებს სატესტო შეკვეთას', async () => {
    localStorage.setItem('tech-store-cart-v1', JSON.stringify([{ productId: 1, quantity: 1 }]));
    const user = userEvent.setup();
    renderInStore(<CartModule />);
    expect(screen.getByLabelText('კუპონის კოდი')).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'უსადენო ყურსასმენი: რაოდენობის გაზრდა' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('tech-store-cart-v1'))[0].quantity).toBe(2));
    await user.type(screen.getByLabelText('კუპონის კოდი'), 'არასწორი');
    await user.click(screen.getByRole('button', { name: 'კუპონის გამოყენება' }));
    expect(screen.getByRole('alert')).toHaveTextContent('კუპონი არასწორია');
    await user.clear(screen.getByLabelText('კუპონის კოდი'));
    await user.type(screen.getByLabelText('კუპონის კოდი'), 'სწავლა10');
    await user.click(screen.getByRole('button', { name: 'კუპონის გამოყენება' }));
    expect(screen.getByText('268,20 ₾')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'კუპონის გაუქმება' }));
    expect(screen.queryByText('268,20 ₾')).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('კუპონის კოდი'), 'სწავლა10');
    await user.click(screen.getByRole('button', { name: 'კუპონის გამოყენება' }));
    await user.click(screen.getByRole('button', { name: 'სატესტო შეკვეთის გაფორმება' }));
    expect(screen.getByText(/სატესტო შეკვეთა გაფორმდა/)).toHaveTextContent('268,20 ₾');
    expect(screen.getByText(/კალათა ცარიელია/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('tech-store-cart-v1'))).toEqual([]);
  });

  it('იცავს მარაგის მაქსიმუმს და პროდუქტის წაშლას', async () => {
    localStorage.setItem('tech-store-cart-v1', JSON.stringify([{ productId: 1, quantity: 12 }]));
    const user = userEvent.setup();
    renderInStore(<CartModule />);
    expect(screen.getByRole('button', { name: 'უსადენო ყურსასმენი: რაოდენობის გაზრდა' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'უსადენო ყურსასმენი: კალათიდან წაშლა' }));
    expect(screen.getByText(/კალათა ცარიელია/)).toBeInTheDocument();
  });
});
