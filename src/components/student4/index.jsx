// ავტორი: სტუდენტი 4 — რჩეული პროდუქტები.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import useFavoriteSearch from '../../hooks/student4/useFavoriteSearch';
import { productType } from '../../utils/propTypes';
import Panel from '../shared/Panel';
import './favorites.css';

export const moduleInfo = { order: 4, title: 'რჩეულები', student: 'სტუდენტი 4' };

export default function FavoritesModule() {
  const { products, cart, favoriteIds, toggleFavorite, addToCart, formatPrice, notify } = useContext(StoreContext);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const searchRef = useRef(null);
  const favoriteProducts = useMemo(() => products.filter((product) => favoriteIds.includes(product.id)), [products, favoriteIds]);
  const visibleProducts = useFavoriteSearch(favoriteProducts, search, sort);
  const total = useMemo(() => favoriteProducts.reduce((sum, product) => sum + product.price, 0), [favoriteProducts]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const clearFilters = useCallback(() => {
    setSearch(''); setSort('name'); searchRef.current?.focus();
  }, []);

  const moveToCart = useCallback((product) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing && existing.quantity >= product.stock) {
      notify('კალათაში უკვე დამატებულია მარაგის მაქსიმალური რაოდენობა. პროდუქტი რჩეულებში დარჩა.');
      return;
    }
    addToCart(product);
    toggleFavorite(product.id);
    notify('პროდუქტი გადატანილია კალათაში და ამოღებულია რჩეულებიდან.');
  }, [cart, addToCart, toggleFavorite, notify]);

  return <Panel title="რჩეული პროდუქტები" description="შეინახე სასურველი პროდუქტები და გადადე არჩევანი მოგვიანებით.">
    <div className="favorites-summary"><span>შენახულია: {favoriteProducts.length} პროდუქტი</span>
      <strong>სიის ღირებულება: {formatPrice(total)}</strong></div>
    <div className="toolbar">
      <label className="grow">რჩეულებში ძებნა<input ref={searchRef} type="search" value={search}
        placeholder="პროდუქტის სახელი" onChange={(event) => setSearch(event.target.value)} /></label>
      <label>დალაგება<select value={sort} onChange={(event) => setSort(event.target.value)}>
        <option value="name">სახელით</option><option value="price-asc">ფასი: დაბლიდან მაღლისკენ</option>
        <option value="price-desc">ფასი: მაღლიდან დაბლისკენ</option>
      </select></label>
      <button type="button" className="secondary" onClick={clearFilters}>ძებნის გასუფთავება</button>
    </div>
    <FavoritesWrapper isEmpty={!favoriteProducts.length}>
      <FavoriteList products={visibleProducts} onRemove={toggleFavorite} onMove={moveToCart} formatPrice={formatPrice} />
    </FavoritesWrapper>
  </Panel>;
}

FavoritesModule.propTypes = {};

export function FavoritesWrapper({ isEmpty, children }) {
  return isEmpty ? <p className="empty-state">რჩეულების სია ცარიელია. შეინახე პროდუქტი გულის ღილაკით ან სწრაფი არჩევიდან.</p>
    : <div className="favorites-wrapper">{children}</div>;
}

FavoritesWrapper.propTypes = { isEmpty: PropTypes.bool.isRequired, children: PropTypes.node.isRequired };

export function FavoriteList({ products, onRemove, onMove, formatPrice }) {
  if (!products.length) return <p className="empty-state">ძებნის მიხედვით რჩეული პროდუქტი ვერ მოიძებნა.</p>;
  return <div className="favorites-list">{products.map((product) => <FavoriteCard key={product.id}
    product={product} onRemove={onRemove} onMove={onMove} formatPrice={formatPrice} />)}</div>;
}

FavoriteList.propTypes = {
  products: PropTypes.arrayOf(productType).isRequired, onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};

export const FavoriteCard = memo(function FavoriteCard({ product, onRemove, onMove, formatPrice }) {
  return <article className="favorites-card">
    <div className="favorites-icon" aria-hidden="true">{product.icon}</div>
    <div className="grow"><p className="muted">{product.category}</p><h3>{product.name}</h3>
      <p>{product.description}</p><strong>{formatPrice(product.price)}</strong></div>
    <div className="favorites-actions"><button type="button" onClick={() => onMove(product)}>კალათაში გადატანა</button>
      <button type="button" className="secondary" aria-label={`${product.name}: რჩეულებიდან წაშლა`}
        onClick={() => onRemove(product.id)}>რჩეულებიდან წაშლა</button></div>
  </article>;
});

FavoriteCard.propTypes = {
  product: productType.isRequired, onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};
