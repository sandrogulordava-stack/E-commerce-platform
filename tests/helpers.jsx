import { StrictMode } from 'react';
import { render } from '@testing-library/react';
import { StoreProvider } from '../src/context/StoreContext';

export function renderInStore(component) {
  return render(<StrictMode><StoreProvider>{component}</StoreProvider></StrictMode>);
}
