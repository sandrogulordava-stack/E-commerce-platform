import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewSection from '../src/components/student3';
import { renderInStore } from './helpers';

describe('სტუდენტი 3 — მიმოხილვები', () => {
  it('აჩვენებს შეცდომებს, ამატებს შეფასებას, ითვლის საშუალოს და ინახავს', async () => {
    const user = userEvent.setup();
    renderInStore(<ReviewSection />);
    expect(screen.getByText('4.5 / 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'მიმოხილვის დამატება' }));
    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(screen.getByLabelText('შენი სახელი')).toHaveFocus();
    await user.type(screen.getByLabelText('შენი სახელი'), 'ტესტერი');
    await user.type(screen.getByLabelText('შენი მიმოხილვა'), 'ძალიან კარგი და კომფორტული პროდუქტია.');
    await user.click(screen.getByRole('button', { name: '3 ვარსკვლავი' }));
    await user.click(screen.getByRole('button', { name: 'მიმოხილვის დამატება' }));
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    expect(screen.getByText('ძალიან კარგი და კომფორტული პროდუქტია.')).toBeInTheDocument();
    expect(screen.getByText('ახალი მიმოხილვა')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('4.0 / 5')).toBeInTheDocument());
    expect(JSON.parse(localStorage.getItem('tech-store-reviews-v1'))).toHaveLength(4);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    await user.selectOptions(screen.getByLabelText('შესაფასებელი პროდუქტი'), '2');
    expect(screen.getByText(/ამ პროდუქტს ჯერ მიმოხილვა არ აქვს/)).toBeInTheDocument();
    expect(screen.getByText('0.0 / 5')).toBeInTheDocument();
  });
});
