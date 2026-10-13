// ავტორი: სტუდენტი 4 — ძებნის დაყოვნება და ფასით/სახელით დალაგება.
import { useEffect, useMemo, useState } from 'react';

export default function useFavoriteSearch(products, search, sort) {
  const [query, setQuery] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  return useMemo(() => {
    const filtered = products.filter((product) => product.name.toLocaleLowerCase('ka-GE')
      .includes(query.trim().toLocaleLowerCase('ka-GE')));
    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name, 'ka');
    });
  }, [products, query, sort]);
}
