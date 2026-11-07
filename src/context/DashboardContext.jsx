import { createContext, useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import dashboardData from '../data/dashboardData';

const STORAGE_KEY = 'cloudview-dashboard-state-v1';

const DashboardContext = createContext(null);

// Extract initial master widgets with their associated categories
function getInitialMasterWidgets(categories) {
  const map = new Map();
  categories.forEach((cat) => {
    cat.widgets.forEach((w) => {
      if (!map.has(w.id)) {
        map.set(w.id, {
          ...w,
          associatedCategoryIds: [cat.id],
        });
      } else {
        const existing = map.get(w.id);
        if (!existing.associatedCategoryIds.includes(cat.id)) {
          existing.associatedCategoryIds.push(cat.id);
        }
      }
    });
  });
  return Array.from(map.values());
}

function getDefaultState() {
  return {
    categories: dashboardData.categories,
    masterWidgets: getInitialMasterWidgets(dashboardData.categories),
  };
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DASHBOARD': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'RESET_DASHBOARD': {
      return getDefaultState();
    }

    case 'ADD_WIDGET': {
      const { widget, categoryIds } = action.payload;

      // 1. Add widget to all selected categories (immutable, avoid duplicates)
      const updatedCategories = state.categories.map((cat) => {
        if (categoryIds.includes(cat.id)) {
          const alreadyExists = cat.widgets.some((w) => w.id === widget.id);
          if (alreadyExists) return cat;
          return {
            ...cat,
            widgets: [...cat.widgets, { ...widget, categoryIds }],
          };
        }
        return cat;
      });

      // 2. Add or update in masterWidgets catalog
      const existingIdx = state.masterWidgets.findIndex((w) => w.id === widget.id);
      let updatedMasterWidgets;
      if (existingIdx >= 0) {
        const prev = state.masterWidgets[existingIdx];
        const mergedCategories = Array.from(
          new Set([...(prev.associatedCategoryIds || []), ...categoryIds])
        );
        updatedMasterWidgets = state.masterWidgets.map((w, idx) =>
          idx === existingIdx ? { ...widget, associatedCategoryIds: mergedCategories } : w
        );
      } else {
        updatedMasterWidgets = [
          ...state.masterWidgets,
          { ...widget, associatedCategoryIds: [...categoryIds] },
        ];
      }

      return {
        ...state,
        categories: updatedCategories,
        masterWidgets: updatedMasterWidgets,
      };
    }

    case 'REMOVE_WIDGET': {
      const { widgetId, categoryId } = action.payload;

      // Remove widget only from the targeted category
      const updatedCategories = state.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            widgets: cat.widgets.filter((w) => w.id !== widgetId),
          };
        }
        return cat;
      });

      // Keep widget in masterWidgets so user can re-assign it from drawer anytime
      return {
        ...state,
        categories: updatedCategories,
      };
    }

    case 'TOGGLE_WIDGET_CATEGORY': {
      const { widget, categoryId, assigned } = action.payload;

      const updatedCategories = state.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;

        if (assigned) {
          if (cat.widgets.some((w) => w.id === widget.id)) return cat;
          return {
            ...cat,
            widgets: [...cat.widgets, { ...widget }],
          };
        } else {
          return {
            ...cat,
            widgets: cat.widgets.filter((w) => w.id !== widget.id),
          };
        }
      });

      // Ensure masterWidgets tracks this association
      const updatedMasterWidgets = state.masterWidgets.map((w) => {
        if (w.id === widget.id) {
          const current = w.associatedCategoryIds || [];
          const next = assigned
            ? Array.from(new Set([...current, categoryId]))
            : current;
          return { ...w, associatedCategoryIds: next };
        }
        return w;
      });

      return {
        ...state,
        categories: updatedCategories,
        masterWidgets: updatedMasterWidgets,
      };
    }

    default:
      return state;
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
      return {
        categories: parsed.categories,
        masterWidgets:
          Array.isArray(parsed.masterWidgets) && parsed.masterWidgets.length > 0
            ? parsed.masterWidgets
            : getInitialMasterWidgets(parsed.categories),
      };
    }
  } catch (err) {
    console.warn('Failed to load dashboard state from localStorage (fallback to defaults):', err);
  }
  return null;
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save dashboard state to localStorage:', err);
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    null,
    () => loadFromStorage() || getDefaultState()
  );

  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState('cat-cspm');

  // Persist to localStorage on every state change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Auto-dismiss notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const openDrawerWithCategory = useCallback((categoryId = 'cat-cspm') => {
    setActiveDrawerTab(categoryId);
    setDrawerOpen(true);
  }, []);

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    dispatch({ type: 'RESET_DASHBOARD' });
    setSearchQuery('');
    showNotification('Dashboard reset to default template', 'info');
  }, [showNotification]);

  // Dynamic statistics calculations
  const totalCategories = useMemo(() => {
    return state.categories.length;
  }, [state.categories]);

  const totalAssignments = useMemo(() => {
    return state.categories.reduce((acc, cat) => acc + cat.widgets.length, 0);
  }, [state.categories]);

  const totalUniqueWidgets = useMemo(() => {
    const uniqueIds = new Set();
    state.categories.forEach((cat) => {
      cat.widgets.forEach((w) => uniqueIds.add(w.id));
    });
    return uniqueIds.size;
  }, [state.categories]);

  const value = {
    state,
    dispatch,
    notification,
    showNotification,
    setNotification,
    searchQuery,
    setSearchQuery,
    drawerOpen,
    setDrawerOpen,
    activeDrawerTab,
    setActiveDrawerTab,
    openDrawerWithCategory,
    resetToDefault,
    totalCategories,
    totalAssignments,
    totalUniqueWidgets,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { DashboardContext };
