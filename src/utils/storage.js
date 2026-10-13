import { getProduct } from './products';

export function readStoredValue(key, fallback, validate = () => true) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value !== null && validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export const isCart = (value) => Array.isArray(value) &&
  new Set(value.map((item) => item?.productId)).size === value.length &&
  value.every((item) => Number.isInteger(item?.productId) && getProduct(item.productId) && Number.isInteger(item.quantity) &&
    item.quantity >= 1 && item.quantity <= getProduct(item.productId).stock);

export const isFavorites = (value) => Array.isArray(value) &&
  new Set(value).size === value.length && value.every((id) => Number.isInteger(id) && getProduct(id));

export const isCoupon = (value) => value === '' || value === 'სწავლა10';
