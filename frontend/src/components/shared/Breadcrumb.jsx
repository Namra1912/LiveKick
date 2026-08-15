// src/components/shared/Breadcrumb.jsx
// Generic breadcrumb — reusable by any page.
// Props: items={[{ label: 'Home', path: '/' }, { label: 'News' }]}
// Last item = current page (no link). Earlier items = <Link> nodes.

import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="breadcrumb__item">
              {!isLast ? (
                <>
                  <Link to={item.path} className="breadcrumb__link">
                    {item.label}
                  </Link>
                  <span className="breadcrumb__sep" aria-hidden="true">/</span>
                </>
              ) : (
                <span className="breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
