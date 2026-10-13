// ავტორი: სტუდენტი 1 — კატალოგი და ფილტრაცია.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import { categories, loadProducts } from '../../utils/products';
import { productType } from '../../utils/propTypes';
import Panel from '../shared/Panel';
import useDebounce from '../../hooks/student1/useDebounce';
import './catalog.css';

export const moduleInfo = { order: 1, title: 'პროდუქტები', student: 'სტუდენტი 1' };

export default function CatalogModule() {
  const { addToCart, toggleFavorite, favoriteIds, formatPrice } = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ყველა');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    loadProducts(controller.signal).then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch((reason) => {
      if (reason.name !== 'AbortError') {
        setError('პროდუქტების ჩატვირთვა ვერ მოხერხდა. სცადე ხელახლა.');
        setLoading(false);
      }
    });
    return () => controller.abort();
  }, [loadAttempt]);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesName = product.name.toLocaleLowerCase('ka-GE').includes(debouncedSearch.trim().toLocaleLowerCase('ka-GE'));
    return matchesName && (category === 'ყველა' || product.category === category);
  }), [products, debouncedSearch, category]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('ყველა');
    searchRef.current?.focus();
  }, []);

  return <Panel title="პროდუქტების კატალოგი" description="მოძებნე პროდუქტი ან აირჩიე სასურველი კატეგორია.">
    <div className="toolbar">
      <label className="grow">პროდუქტის ძებნა<input ref={searchRef} type="search" value={search}
        placeholder="მაგალითად: ყურსასმენი" onChange={(event) => setSearch(event.target.value)} /></label>
      <label>კატეგორია<select value={category} onChange={(event) => setCategory(event.target.value)}>
        <option>ყველა</option>{categories.map((name) => <option key={name}>{name}</option>)}
      </select></label>
      <button type="button" className="secondary" onClick={clearFilters}>ფილტრების გასუფთავება</button>
    </div>
    <ProductGrid products={filtered} loading={loading} error={error} favoriteIds={favoriteIds}
      onAdd={addToCart} onFavorite={toggleFavorite} formatPrice={formatPrice}
      onRetry={() => setLoadAttempt((attempt) => attempt + 1)} />
  </Panel>;
}

CatalogModule.propTypes = {};

export function ProductGrid({ products, loading, error, favoriteIds, onAdd, onFavorite, formatPrice, onRetry }) {
  if (loading) return <p className="empty-state" role="status">იტვირთება პროდუქტები...</p>;
  if (error) return <div className="empty-state"><p role="alert">{error}</p><button type="button" onClick={onRetry}>ხელახლა ცდა</button></div>;
  if (!products.length) return <p className="empty-state">პროდუქტი ვერ მოიძებნა. შეცვალე ძებნა ან კატეგორია.</p>;
  return <><p className="result-count">ნაპოვნია {products.length} პროდუქტი</p><div className="catalog-grid">
    {products.map((product) => <ProductCard key={product.id} product={product}
      isFavorite={favoriteIds.includes(product.id)} onAdd={onAdd} onFavorite={onFavorite} formatPrice={formatPrice} />)}
  </div></>;
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(productType).isRequired, loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired, favoriteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onAdd: PropTypes.func.isRequired, onFavorite: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired, onRetry: PropTypes.func.isRequired,
};

export const ProductCard = memo(function ProductCard({ product, isFavorite, onAdd, onFavorite, formatPrice }) {
  return <article className="catalog-card">
    <div className="catalog-image"><span aria-hidden="true">{product.icon}</span>
      {product.oldPrice > product.price && <span className="catalog-sale">ფასდაკლება</span>}
    </div>
    <p className="muted">{product.category}</p><h3>{product.name}</h3><p>{product.description}</p>
    <div className="catalog-price"><strong>{formatPrice(product.price)}</strong>
      {product.oldPrice > product.price && <del>{formatPrice(product.oldPrice)}</del>}</div>
    <div className="catalog-actions">
      <button type="button" onClick={() => onAdd(product)}>კალათაში დამატება</button>
      <button type="button" className="secondary" aria-pressed={isFavorite}
        aria-label={`${product.name}: ${isFavorite ? 'რჩეულებიდან წაშლა' : 'რჩეულებში დამატება'}`}
        onClick={() => onFavorite(product.id)}>{isFavorite ? '♥' : '♡'}</button>
    </div>
  </article>;
});

ProductCard.propTypes = {
  product: productType.isRequired, isFavorite: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired, onFavorite: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};
