import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  Clock,
  SearchX,
  CheckCircle,
  ChevronDown,
  MoreVertical,
  RotateCcw,
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import CategorySection from './components/CategorySection';
import AddWidgetDrawer from './components/AddWidgetDrawer';
import useDashboard from './hooks/useDashboard';

import './styles/global.css';
import './styles/dashboard.css';
import './styles/components.css';

export default function App() {
  const {
    state,
    searchQuery,
    setSearchQuery,
    setDrawerOpen,
    setActiveDrawerTab,
    notification,
    showNotification,
    resetToDefault,
  } = useDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  // Close more menu when clicking outside
  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreMenuOpen]);

  // Generates "Last 2 days" formatted string
  const dateRange = useMemo(() => {
    return 'Last 2 days';
  }, []);

  // Filter categories and widgets based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    return state.categories
      .map((cat) => {
        const matchingWidgets = cat.widgets.filter(
          (w) =>
            w.name.toLowerCase().includes(q) ||
            (w.text && w.text.toLowerCase().includes(q)) ||
            cat.name.toLowerCase().includes(q)
        );
        return {
          ...cat,
          widgets: matchingWidgets,
        };
      })
      .filter((cat) => cat.widgets.length > 0);
  }, [searchQuery, state.categories]);

  const isSearching = searchQuery.trim().length > 0;
  const categoriesToRender = isSearching ? filteredCategories : state.categories;

  const totalMatchingWidgets = useMemo(() => {
    if (!filteredCategories) return 0;
    return filteredCategories.reduce((acc, cat) => acc + cat.widgets.length, 0);
  }, [filteredCategories]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Dashboard refreshed', 'info');
    }, 400);
  };

  const handleAddWidgetClick = () => {
    setActiveDrawerTab('cat-cspm');
    setDrawerOpen(true);
  };

  const handleResetToDefault = () => {
    setMoreMenuOpen(false);
    if (window.confirm('Reset dashboard to original assignment seed data? All custom additions will be cleared.')) {
      resetToDefault();
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="main-content">
        <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        {/* Dashboard Toolbar matching the PDF Screenshot */}
        <section className="dashboard-toolbar">
          <div className="toolbar-left">
            <h1 className="toolbar-heading">CNAPP Dashboard</h1>
          </div>

          <div className="toolbar-right">
            <button
              type="button"
              className="btn-toolbar-add"
              onClick={handleAddWidgetClick}
              aria-label="Add Widget"
            >
              <span>Add Widget</span>
              <Plus size={15} />
            </button>

            <button
              type="button"
              className={`btn-toolbar-icon ${isRefreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              title="Refresh dashboard"
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={15} />
            </button>

            {/* More Options Dropdown */}
            <div className="toolbar-menu-wrapper" ref={moreMenuRef}>
              <button
                type="button"
                className="btn-toolbar-icon"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                title="More dashboard options"
                aria-label="More dashboard options"
                aria-expanded={moreMenuOpen}
              >
                <MoreVertical size={16} />
              </button>

              {moreMenuOpen && (
                <div className="toolbar-dropdown-menu" role="menu">
                  <button
                    type="button"
                    className="toolbar-dropdown-item"
                    onClick={handleResetToDefault}
                    role="menuitem"
                  >
                    <RotateCcw size={14} />
                    <span>Reset to Default State</span>
                  </button>
                  <button
                    type="button"
                    className="toolbar-dropdown-item"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      handleRefresh();
                    }}
                    role="menuitem"
                  >
                    <RefreshCw size={14} />
                    <span>Sync & Refresh Data</span>
                  </button>
                </div>
              )}
            </div>

            <div className="date-range-badge" title="Active date filter">
              <Clock size={15} className="date-icon" />
              <div className="date-divider" />
              <span className="date-text">{dateRange}</span>
              <ChevronDown size={14} className="date-arrow" />
            </div>
          </div>
        </section>

        {/* Dashboard Main Body */}
        <div className="dashboard-body">
          {/* Summary Statistics Cards (shown when not searching) */}
          {!isSearching && <DashboardStats />}

          {/* Search Results Summary Banner */}
          {isSearching && (
            <div className="search-banner">
              <div className="search-banner-text">
                <h3>
                  Search results for <strong>&quot;{searchQuery}&quot;</strong>
                </h3>
                <span className="search-count">
                  {totalMatchingWidgets} matching {totalMatchingWidgets === 1 ? 'widget' : 'widgets'} found across categories
                </span>
              </div>
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Empty Search Results */}
          {isSearching && categoriesToRender && categoriesToRender.length === 0 && (
            <div className="empty-search-state">
              <SearchX size={52} className="empty-search-icon" />
              <h3>No Widgets Found</h3>
              <p>
                No widgets match your search <strong>&quot;{searchQuery}&quot;</strong>. Try searching for &quot;Cloud&quot;, &quot;Risk&quot;, &quot;Alerts&quot;, or &quot;Tickets&quot;.
              </p>
              <button
                type="button"
                className="btn-reset-search"
                onClick={() => setSearchQuery('')}
              >
                View All Widgets
              </button>
            </div>
          )}

          {/* Dynamic Category Sections */}
          {categoriesToRender &&
            categoriesToRender.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
        </div>
      </main>

      {/* Widget Management / Creation Drawer */}
      <AddWidgetDrawer />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`notification-toast ${notification.type || 'success'}`}
          role="alert"
          aria-live="polite"
        >
          <CheckCircle size={16} />
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
