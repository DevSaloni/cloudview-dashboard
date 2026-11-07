import { LayoutDashboard, Layers, FolderKanban, Settings, Cloud, X } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: false },
  { icon: Layers, label: 'Dashboards', active: true },
  { icon: FolderKanban, label: 'Categories', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Sidebar navigation">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Cloud size={20} color="#ffffff" />
          </div>
          <div className="sidebar-logo-text">
            <h1>CloudView</h1>
            <span>Security Dashboard</span>
          </div>
          <button
            type="button"
            className="sidebar-close-mobile"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              aria-current={item.active ? 'page' : undefined}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-badge">CNAPP v2.4</div>
          <p>CloudView Enterprise</p>
        </div>
      </aside>
    </>
  );
}
