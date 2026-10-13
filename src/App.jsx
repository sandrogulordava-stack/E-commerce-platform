import { useState } from 'react';
import Header from './components/shared/Header';

const entries = import.meta.glob('./components/student*/index.jsx', { eager: true });
const modules = Object.values(entries).sort((a, b) => a.moduleInfo.order - b.moduleInfo.order);

export default function App() {
  const [active, setActive] = useState(modules[0].moduleInfo.order);
  const selected = modules.find((entry) => entry.moduleInfo.order === active);
  const Module = selected.default;
  return <div className="site-container">
    <Header />
    <nav className="navigation" aria-label="მაღაზიის განყოფილებები">
      {modules.map(({ moduleInfo }) => <button type="button" key={moduleInfo.order}
        className={active === moduleInfo.order ? 'active' : 'secondary'}
        aria-current={active === moduleInfo.order ? 'page' : undefined}
        onClick={() => setActive(moduleInfo.order)}>{moduleInfo.title}</button>)}
    </nav>
    <main><Module /></main>
    <footer>ტექნო მაღაზია · სასწავლო პროექტი · შეკვეთისას თანხა არ ჩამოიჭრება</footer>
  </div>;
}

App.propTypes = {};
