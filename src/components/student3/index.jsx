// ავტორი: სტუდენტი 3 — მიმოხილვები და რეიტინგი.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import { readStoredValue } from '../../utils/storage';
import { initialReviews, isReviews } from '../../utils/reviews';
import { productType, reviewType } from '../../utils/propTypes';
import useFormValidation from '../../hooks/student3/useFormValidation';
import Panel from '../shared/Panel';
import './reviews.css';

export const moduleInfo = { order: 3, title: 'მიმოხილვები', student: 'სტუდენტი 3' };
const emptyForm = { author: '', text: '', rating: 0 };

export default function ReviewSection() {
  const { products, notify } = useContext(StoreContext);
  const [productId, setProductId] = useState(products[0].id);
  const [reviews, setReviews] = useState(() => readStoredValue('tech-store-reviews-v1', initialReviews, isReviews));
  const [values, setValues] = useState(emptyForm);
  const [average, setAverage] = useState(0);
  const [latestId, setLatestId] = useState(null);
  const [storageError, setStorageError] = useState('');
  const latestReviewRef = useRef(null);
  const nameRef = useRef(null);
  const { errors, validate, resetErrors } = useFormValidation();

  const visibleReviews = useMemo(() => reviews.filter((review) => review.productId === productId)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)), [reviews, productId]);

  useEffect(() => {
    const total = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
    setAverage(visibleReviews.length ? total / visibleReviews.length : 0);
  }, [visibleReviews]);

  useEffect(() => {
    try {
      localStorage.setItem('tech-store-reviews-v1', JSON.stringify(reviews));
      setStorageError('');
    } catch {
      setStorageError('მიმოხილვის შენახვა მიუწვდომელია. გვერდის განახლებამდე ის სიაში დარჩება.');
    }
  }, [reviews]);

  useEffect(() => {
    if (latestId) latestReviewRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [latestId]);

  const handleChange = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (!validate(values)) {
      nameRef.current?.focus();
      return;
    }
    const review = {
      id: crypto.randomUUID(), productId, author: values.author.trim(),
      text: values.text.trim(), rating: values.rating, date: new Date().toISOString(),
    };
    setReviews((current) => [...current, review]);
    setLatestId(review.id);
    setValues(emptyForm);
    resetErrors();
    notify('შენი მიმოხილვა დაემატა.');
  }, [values, productId, validate, resetErrors, notify]);

  const handleProductChange = useCallback((nextId) => {
    setProductId(nextId);
    setValues(emptyForm);
    resetErrors();
    setLatestId(null);
  }, [resetErrors]);

  return <Panel title="მომხმარებლის მიმოხილვები" description="აირჩიე პროდუქტი და გაუზიარე სხვებს შენი შეფასება.">
    {storageError && <p role="alert" className="error-text">{storageError}</p>}
    <div className="toolbar"><label className="grow">შესაფასებელი პროდუქტი<select value={productId}
      onChange={(event) => handleProductChange(Number(event.target.value))}>
      {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
    </select></label><div className="reviews-average" role="status">
      <strong>{average.toFixed(1)} / 5</strong><span>{visibleReviews.length} მიმოხილვა</span>
    </div></div>
    <div className="reviews-layout">
      <ReviewForm values={values} errors={errors} onChange={handleChange} onSubmit={handleSubmit} nameRef={nameRef} />
      <ReviewList reviews={visibleReviews} latestId={latestId} latestReviewRef={latestReviewRef}
        product={products.find((product) => product.id === productId)} />
    </div>
  </Panel>;
}

ReviewSection.propTypes = {};

export function ReviewForm({ values, errors, onChange, onSubmit, nameRef }) {
  return <form className="reviews-form" onSubmit={onSubmit} noValidate>
    <h3>დატოვე მიმოხილვა</h3>
    <label>შენი სახელი<input ref={nameRef} value={values.author} maxLength={40}
      aria-invalid={Boolean(errors.author)} aria-describedby={errors.author ? 'review-author-error' : undefined}
      onChange={(event) => onChange('author', event.target.value)} /></label>
    {errors.author && <p id="review-author-error" role="alert" className="error-text">{errors.author}</p>}
    <StarRating value={values.rating} onChange={(rating) => onChange('rating', rating)} error={errors.rating} />
    <label>შენი მიმოხილვა<textarea rows={5} maxLength={500} value={values.text}
      aria-invalid={Boolean(errors.text)} aria-describedby={errors.text ? 'review-text-error' : 'review-text-help'}
      onChange={(event) => onChange('text', event.target.value)} /></label>
    <p id="review-text-help" className="muted">მინიმუმ 10, მაქსიმუმ 500 სიმბოლო.</p>
    {errors.text && <p id="review-text-error" role="alert" className="error-text">{errors.text}</p>}
    <button type="submit">მიმოხილვის დამატება</button>
  </form>;
}

ReviewForm.propTypes = {
  values: PropTypes.shape({ author: PropTypes.string.isRequired, text: PropTypes.string.isRequired, rating: PropTypes.number.isRequired }).isRequired,
  errors: PropTypes.shape({ author: PropTypes.string, text: PropTypes.string, rating: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired,
  nameRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};

export const StarRating = memo(function StarRating({ value, onChange, error }) {
  return <fieldset className="reviews-rating" aria-describedby={error ? 'review-rating-error' : undefined}>
    <legend>შეფასება ვარსკვლავებით</legend>
    <div className="reviews-stars">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating}
      className={rating <= value ? 'reviews-star selected' : 'reviews-star'}
      aria-label={`${rating} ვარსკვლავი`} aria-pressed={value === rating}
      onClick={() => onChange(rating)}>★</button>)}</div>
    {error && <p id="review-rating-error" role="alert" className="error-text">{error}</p>}
  </fieldset>;
});

StarRating.propTypes = { value: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired, error: PropTypes.string };

export function ReviewList({ reviews, latestId, latestReviewRef, product }) {
  return <div className="reviews-list"><h3>{product.name}: შეფასებები</h3>
    {!reviews.length ? <p className="empty-state">ამ პროდუქტს ჯერ მიმოხილვა არ აქვს. იყავი პირველი!</p>
      : reviews.map((review) => <ReviewCard key={review.id} review={review}
        isNew={review.id === latestId} scrollRef={review.id === latestId ? latestReviewRef : undefined} />)}
  </div>;
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(reviewType).isRequired, latestId: PropTypes.string,
  latestReviewRef: PropTypes.shape({ current: PropTypes.any }).isRequired, product: productType.isRequired,
};

export function ReviewCard({ review, isNew, scrollRef }) {
  return <article ref={scrollRef} className={`reviews-card${isNew ? ' reviews-new' : ''}`}>
    <div className="reviews-card-top"><strong>{review.author}</strong>
      <span aria-label={`შეფასება: ${review.rating} ხუთიდან`} className="reviews-static-stars">
        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div>
    <p className="reviews-comment">{review.text}</p>
    <time dateTime={review.date} className="muted">{new Intl.DateTimeFormat('ka-GE').format(new Date(review.date))}</time>
    {isNew && <span className="reviews-new-label">ახალი მიმოხილვა</span>}
  </article>;
}

ReviewCard.propTypes = {
  review: reviewType.isRequired, isNew: PropTypes.bool.isRequired,
  scrollRef: PropTypes.shape({ current: PropTypes.any }),
};
