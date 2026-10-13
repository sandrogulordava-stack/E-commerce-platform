// ავტორი: სტუდენტი 3.
import { useCallback, useState } from 'react';

export function validateReview(values) {
  const errors = {};
  if (values.author.trim().length < 2) errors.author = 'სახელი მინიმუმ 2 სიმბოლოს უნდა შეიცავდეს.';
  if (values.author.trim().length > 40) errors.author = 'სახელი მაქსიმუმ 40 სიმბოლოს უნდა შეიცავდეს.';
  if (values.text.trim().length < 10) errors.text = 'მიმოხილვა მინიმუმ 10 სიმბოლოს უნდა შეიცავდეს.';
  if (values.text.trim().length > 500) errors.text = 'მიმოხილვა მაქსიმუმ 500 სიმბოლოს უნდა შეიცავდეს.';
  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) errors.rating = 'აირჩიე შეფასება 1-დან 5 ვარსკვლავამდე.';
  return errors;
}

export default function useFormValidation() {
  const [errors, setErrors] = useState({});
  const validate = useCallback((values) => {
    const nextErrors = validateReview(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);
  const resetErrors = useCallback(() => setErrors({}), []);
  return { errors, validate, resetErrors };
}
