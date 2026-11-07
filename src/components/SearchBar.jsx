import { Search, X } from 'lucide-react';
import useDashboard from '../hooks/useDashboard';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useDashboard();

  return (
    <div className="header-search">
      <Search size={15} className="header-search-icon" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search anything..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search widgets"
      />
      {searchQuery && (
        <button
          type="button"
          className="header-search-clear"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
