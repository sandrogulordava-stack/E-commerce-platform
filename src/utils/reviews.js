import { getProduct } from './products';

export const initialReviews = [
  { id: 'initial-1', productId: 1, author: 'მომხმარებელი', text: 'კომფორტულია და ხმა ძალიან მომწონს.', rating: 5, date: '2026-01-10T12:00:00.000Z' },
  { id: 'initial-2', productId: 1, author: 'მყიდველი', text: 'ყოველდღიური გამოყენებისთვის კარგი არჩევანია.', rating: 4, date: '2026-01-11T12:00:00.000Z' },
  { id: 'initial-3', productId: 4, author: 'სტუდენტი', text: 'სწავლის დროს მოხერხებული და მსუბუქია.', rating: 4, date: '2026-01-12T12:00:00.000Z' },
];

export const isReviews = (value) => Array.isArray(value) &&
  new Set(value.map((review) => review?.id)).size === value.length &&
  value.every((review) => review && typeof review.id === 'string' && Number.isInteger(review.productId) && getProduct(review.productId) &&
    typeof review.author === 'string' && review.author.trim().length >= 2 && review.author.length <= 40 &&
    typeof review.text === 'string' && review.text.trim().length >= 10 && review.text.length <= 500 &&
    Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 &&
    typeof review.date === 'string' && !Number.isNaN(Date.parse(review.date)));
