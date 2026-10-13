import { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { getProduct } from '../../utils/products';

export default function Header() {
  const { currency, setCurrency, products, cart, favoriteIds, addToCart, toggleFavorite } = useContext(StoreContext);
  const [productId, setProductId] = useState(products[0].id);
  const product = getProduct(productId);
  return <>
    <header className="header">
      <div><h1>ტექნო მაღაზია</h1><p>ტექნიკა ყოველდღიური ცხოვრებისთვის</p></div>
      <div className="header-actions">
        <span>კალათა: {cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        <span>რჩეულები: {favoriteIds.length}</span>
        <label>ვალუტა<select value={currency} onChange={(event) => setCurrency(event.target.value)}>
          <option value="GEL">ლარი ₾</option><option value="USD">დოლარი $</option>
        </select></label>
      </div>
    </header>
    <div className="intro"><h2>აირჩიე, შეინახე და შეაფასე</h2>
      <p>დაათვალიერე პროდუქტები და შეადგინე სასურველი შენაძენების სია.</p>
      <p className="muted">სასწავლო მაღაზია — შეკვეთა სატესტოა. დოლარში ფასი ითვლება ფიქსირებული კურსით: 1 დოლარი = 2.70 ლარი.</p>
    </div>
    <details className="quick-pick"><summary>პროდუქტის სწრაფი არჩევა</summary>
      <div className="toolbar"><label>პროდუქტი<select value={productId} onChange={(event) => setProductId(Number(event.target.value))}>
        {products.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </select></label>
      <button type="button" onClick={() => addToCart(product)}>კალათაში დამატება</button>
      <button type="button" className="secondary" onClick={() => toggleFavorite(product.id)}>
        {favoriteIds.includes(product.id) ? 'რჩეულებიდან წაშლა' : 'რჩეულებში დამატება'}
      </button></div>
    </details>
  </>;
}

Header.propTypes = {};
