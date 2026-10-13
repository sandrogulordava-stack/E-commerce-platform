import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import { products, getProduct } from '../utils/products';
import { isCart, isFavorites } from '../utils/storage';

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart, cartError] = useLocalStorage('tech-store-cart-v1', [], isCart);
  const [favoriteIds, setFavoriteIds, favoritesError] = useLocalStorage('tech-store-favorites-v1', [], isFavorites);
  const [currency, setCurrency] = useState('GEL');
  const [notice, setNotice] = useState('');
  const [noticeTick, setNoticeTick] = useState(0);
  const noticeTimer = useRef(null);

  const notify = useCallback((message) => {
    setNotice(message);
    setNoticeTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    if (notice) noticeTimer.current = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(noticeTimer.current);
  }, [notice, noticeTick]);

  const addToCart = useCallback((product) => {
    if (!getProduct(product.id)) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) return current.map((item) => item.productId === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      return [...current, { productId: product.id, quantity: 1 }];
    });
    notify('კალათა განახლდა. რაოდენობა მარაგის ფარგლებში იცვლება.');
  }, [setCart, notify]);

  const updateQuantity = useCallback((productId, quantity) => {
    const product = getProduct(productId);
    if (!product || !Number.isInteger(quantity)) return;
    setCart((current) => current.map((item) => item.productId === productId
      ? { ...item, quantity: Math.max(1, Math.min(quantity, product.stock)) } : item));
  }, [setCart]);

  const removeFromCart = useCallback((productId) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
    notify('პროდუქტი წაიშალა კალათიდან.');
  }, [setCart, notify]);

  const toggleFavorite = useCallback((productId) => {
    if (!getProduct(productId)) return;
    setFavoriteIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId) : [...current, productId]);
    notify('რჩეულების სია განახლდა.');
  }, [setFavoriteIds, notify]);

  const clearCart = useCallback(() => setCart([]), [setCart]);
  const formatPrice = useCallback((price) => {
    const amount = currency === 'USD' ? price / 2.7 : price;
    const number = new Intl.NumberFormat('ka-GE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    return `${number} ${currency === 'GEL' ? '₾' : '$'}`;
  }, [currency]);

  const value = useMemo(() => ({
    products, cart, favoriteIds, currency, setCurrency, addToCart, updateQuantity,
    removeFromCart, toggleFavorite, clearCart, formatPrice, notify,
  }), [cart, favoriteIds, currency, addToCart, updateQuantity, removeFromCart, toggleFavorite, clearCart, formatPrice, notify]);

  return <StoreContext.Provider value={value}>
    {children}
    {(cartError || favoritesError) && <p className="storage-warning" role="alert">{cartError || favoritesError}</p>}
    <div className="toast" role="status" aria-live="polite">{notice}</div>
  </StoreContext.Provider>;
}

StoreProvider.propTypes = { children: PropTypes.node.isRequired };
