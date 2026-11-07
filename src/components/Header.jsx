import { Bell, ChevronRight, Menu } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header({ onMenuToggle }) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="#home">Home</a>
          <ChevronRight size={13} className="breadcrumb-separator" />
          <span className="current">Dashboard V2</span>
        </nav>
      </div>

      <div className="header-right">
        <SearchBar />

        <button
          type="button"
          className="header-icon-btn"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div
          className="header-avatar"
          role="img"
          aria-label="User avatar for Saloni Pawar"
          title="Saloni Pawar"
        >
          <span>SP</span>
        </div>
      </div>
    </header>
  );
}
