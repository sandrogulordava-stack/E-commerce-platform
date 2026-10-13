// ავტორი: სტუდენტი 2 — კალათა; src/hooks/useLocalStorage.js ასევე ამ სტუდენტის ნაწილია.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { products, getProduct } from '../../utils/products';
import { calculateTotals } from '../../utils/cart';
import { isCoupon } from '../../utils/storage';
import { cartItemType, productType } from '../../utils/propTypes';
import Panel from '../shared/Panel';
import './cart.css';

export const moduleInfo = { order: 2, title: 'კალათა', student: 'სტუდენტი 2' };

export default function CartModule() {
  const { cart, updateQuantity, removeFromCart, clearCart, formatPrice } = useContext(StoreContext);
  const [coupon, setCoupon, storageError] = useLocalStorage('tech-store-coupon-v1', '', isCoupon);
  const [couponInput, setCouponInput] = useState(coupon);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const couponRef = useRef(null);
  const totals = useMemo(() => calculateTotals(cart, coupon, products), [cart, coupon]);

  useEffect(() => {
    couponRef.current?.focus();
  }, []);

  const applyCoupon = useCallback((event) => {
    event.preventDefault();
    const value = couponInput.trim();
    if (value !== 'სწავლა10') {
      setCouponError(true);
      setCouponMessage('კუპონი არასწორია. გამოიყენე სწავლა10.');
      couponRef.current?.focus();
      return;
    }
    setCoupon(value);
    setCouponError(false);
    setCouponMessage('კუპონი გამოყენებულია: ფასდაკლება 10%.');
  }, [couponInput, setCoupon]);

  const checkout = useCallback(() => {
    if (!cart.length) return;
    setOrderMessage(`სატესტო შეკვეთა გაფორმდა. ჯამი: ${formatPrice(totals.total)}. თანხა არ ჩამოჭრილა.`);
    clearCart();
    setCoupon('');
    setCouponInput('');
    setCouponMessage('');
  }, [cart.length, totals.total, formatPrice, clearCart, setCoupon]);

  const removeCoupon = useCallback(() => {
    setCoupon(''); setCouponInput(''); setCouponMessage(''); setCouponError(false);
    couponRef.current?.focus();
  }, [setCoupon]);

  return <Panel title="საყიდლების კალათა" description="შეცვალე რაოდენობა, გამოიყენე კუპონი და ნახე შეკვეთის ჯამი.">
    {storageError && <p role="alert" className="error-text">{storageError}</p>}
    {orderMessage && <p role="status" className="success-text">{orderMessage}</p>}
    <CartWrapper isEmpty={!cart.length}>
      <div className="cart-layout">
        <CartList items={cart} onQuantity={updateQuantity} onRemove={removeFromCart} formatPrice={formatPrice} />
        <aside className="cart-summary" aria-label="შეკვეთის შეჯამება">
          <h3>შეკვეთის შეჯამება</h3>
          <p><span>პროდუქტების ჯამი</span><strong>{formatPrice(totals.subtotal)}</strong></p>
          <p><span>ფასდაკლება</span><strong>{formatPrice(totals.discount)}</strong></p>
          <p className="cart-total"><span>გადასახდელი</span><strong>{formatPrice(totals.total)}</strong></p>
          <form onSubmit={applyCoupon} noValidate>
            <label>კუპონის კოდი<input ref={couponRef} value={couponInput}
              aria-invalid={couponError} aria-describedby={couponMessage ? 'coupon-message' : 'coupon-help'}
              onChange={(event) => setCouponInput(event.target.value)} placeholder="სწავლა10" /></label>
            <p id="coupon-help" className="muted">კუპონი სწავლა10 გაძლევს 10% ფასდაკლებას.</p>
            <button type="submit" className="secondary">კუპონის გამოყენება</button>
          </form>
          {couponMessage && <p id="coupon-message" role={couponError ? 'alert' : 'status'}
            className={couponError ? 'error-text' : 'success-text'}>{couponMessage}</p>}
          {coupon && <button type="button" className="text-button" onClick={removeCoupon}>კუპონის გაუქმება</button>}
          <button type="button" className="cart-checkout" onClick={checkout}>სატესტო შეკვეთის გაფორმება</button>
          <p className="muted">რეალური გადახდა არ სრულდება.</p>
        </aside>
      </div>
    </CartWrapper>
  </Panel>;
}

CartModule.propTypes = {};

export function CartWrapper({ isEmpty, children }) {
  return isEmpty ? <p className="empty-state">კალათა ცარიელია. დაამატე პროდუქტი კატალოგიდან ან სწრაფი არჩევიდან.</p>
    : <div className="cart-wrapper">{children}</div>;
}

CartWrapper.propTypes = { isEmpty: PropTypes.bool.isRequired, children: PropTypes.node.isRequired };

export function CartList({ items, onQuantity, onRemove, formatPrice }) {
  return <div className="cart-list">{items.map((item) => <CartItem key={item.productId}
    item={item} product={getProduct(item.productId)} onQuantity={onQuantity}
    onRemove={onRemove} formatPrice={formatPrice} />)}</div>;
}

CartList.propTypes = {
  items: PropTypes.arrayOf(cartItemType).isRequired, onQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};

export const CartItem = memo(function CartItem({ item, product, onQuantity, onRemove, formatPrice }) {
  return <article className="cart-item">
    <span className="cart-icon" aria-hidden="true">{product.icon}</span>
    <div className="grow"><h3>{product.name}</h3><p className="muted">ერთეულის ფასი: {formatPrice(product.price)}</p>
      <div className="cart-quantity" role="group" aria-label={`${product.name}: რაოდენობა`}>
        <button type="button" className="secondary" disabled={item.quantity === 1}
          aria-label={`${product.name}: რაოდენობის შემცირება`} onClick={() => onQuantity(product.id, item.quantity - 1)}>−</button>
        <span aria-live="polite">{item.quantity}</span>
        <button type="button" className="secondary" disabled={item.quantity >= product.stock}
          aria-label={`${product.name}: რაოდენობის გაზრდა`} onClick={() => onQuantity(product.id, item.quantity + 1)}>+</button>
      </div><p className="muted">მარაგში: {product.stock}</p>
    </div>
    <div className="cart-item-end"><strong>{formatPrice(product.price * item.quantity)}</strong>
      <button type="button" className="text-button danger" aria-label={`${product.name}: კალათიდან წაშლა`}
        onClick={() => onRemove(product.id)}>წაშლა</button></div>
  </article>;
});

CartItem.propTypes = {
  item: cartItemType.isRequired, product: productType.isRequired,
  onQuantity: PropTypes.func.isRequired, onRemove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};
