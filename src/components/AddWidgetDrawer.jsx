import { useState, useMemo, useEffect, useCallback } from 'react';
import { X, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import useDashboard from '../hooks/useDashboard';

export default function AddWidgetDrawer() {
  const {
    state,
    dispatch,
    drawerOpen,
    setDrawerOpen,
    activeDrawerTab,
    setActiveDrawerTab,
    showNotification,
  } = useDashboard();

  // Form states for creating a new widget
  const [widgetName, setWidgetName] = useState('');
  const [widgetText, setWidgetText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(() => [
    activeDrawerTab && activeDrawerTab !== 'add-new' ? activeDrawerTab : 'cat-cspm',
  ]);
  const [errors, setErrors] = useState({});
  const [showOtherWidgets, setShowOtherWidgets] = useState(false);

  const resetForm = useCallback(() => {
    setWidgetName('');
    setWidgetText('');
    setSelectedCategoryIds([
      activeDrawerTab && activeDrawerTab !== 'add-new' ? activeDrawerTab : 'cat-cspm',
    ]);
    setErrors({});
  }, [activeDrawerTab]);

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
    resetForm();
  }, [setDrawerOpen, resetForm]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, handleClose]);

  const handleTabChange = (tabId) => {
    setActiveDrawerTab(tabId);
    if (tabId !== 'add-new') {
      setSelectedCategoryIds([tabId]);
    }
    setShowOtherWidgets(false);
  };

  const handleToggleFormCategory = (catId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: undefined }));
    }
  };

  const handleCreateWidget = (e) => {
    if (e) e.preventDefault();

    const trimmedName = widgetName.trim();
    const trimmedText = widgetText.trim();
    const newErrors = {};

    if (!trimmedName) {
      newErrors.name = 'Widget Name is required';
    }
    if (!trimmedText) {
      newErrors.text = 'Widget Text is required';
    }
    if (selectedCategoryIds.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }

    // Check for duplicate widget name in the selected categories
    if (trimmedName && selectedCategoryIds.length > 0) {
      const isDuplicate = selectedCategoryIds.some((catId) => {
        const cat = state.categories.find((c) => c.id === catId);
        return cat?.widgets.some(
          (w) => w.name.trim().toLowerCase() === trimmedName.toLowerCase()
        );
      });
      if (isDuplicate) {
        newErrors.name = 'A widget with this name already exists in the selected category';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const uniqueId = `widget-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newWidget = {
      id: uniqueId,
      name: trimmedName,
      text: trimmedText,
      type: 'custom',
      categoryIds: selectedCategoryIds,
      data: {},
    };

    dispatch({
      type: 'ADD_WIDGET',
      payload: {
        widget: newWidget,
        categoryIds: selectedCategoryIds,
      },
    });

    showNotification(`Widget "${newWidget.name}" added successfully`);
    handleClose();
  };

  // Toggle widget assignment for a category
  const handleToggleWidgetAssignment = (widget, categoryId, isAssigned) => {
    dispatch({
      type: 'TOGGLE_WIDGET_CATEGORY',
      payload: {
        widget,
        categoryId,
        assigned: isAssigned,
      },
    });

    showNotification(
      isAssigned
        ? `"${widget.name}" assigned to category`
        : `"${widget.name}" removed from category`
    );
  };

  // Current category object
  const currentCategory = useMemo(() => {
    return state.categories.find((c) => c.id === activeDrawerTab);
  }, [state.categories, activeDrawerTab]);

  // Widgets primary to this category (associated or assigned)
  const primaryCategoryWidgets = useMemo(() => {
    if (!currentCategory) return [];
    const assignedIds = new Set(currentCategory.widgets.map((w) => w.id));

    return state.masterWidgets
      .filter((w) => {
        const isAssociated = w.associatedCategoryIds?.includes(activeDrawerTab);
        const isAssigned = assignedIds.has(w.id);
        return isAssociated || isAssigned;
      })
      .map((w) => ({
        ...w,
        isAssigned: assignedIds.has(w.id),
      }));
  }, [currentCategory, state.masterWidgets, activeDrawerTab]);

  // Other system widgets (available to be assigned to this category if user wants)
  const otherAvailableWidgets = useMemo(() => {
    if (!currentCategory) return [];
    const primaryIds = new Set(primaryCategoryWidgets.map((w) => w.id));

    return state.masterWidgets
      .filter((w) => !primaryIds.has(w.id))
      .map((w) => ({
        ...w,
        isAssigned: false,
      }));
  }, [currentCategory, primaryCategoryWidgets, state.masterWidgets]);

  if (!drawerOpen) return null;

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header matching the PDF styling (Dark Navy Banner) */}
        <div className="drawer-header-dark">
          <div className="drawer-header-content">
            <h2 id="drawer-title">Add Widget</h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={handleClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Subheader matching PDF Page 2 & 3 */}
        <div className="drawer-subheader">
          <p>Personalise your dashboard by adding the following widget</p>
        </div>

        {/* Category Tabs: CSPM, CWPP, Image, Ticket, + New Widget */}
        <div className="drawer-nav-tabs" role="tablist">
          {state.categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeDrawerTab === cat.id}
              className={`drawer-nav-tab ${activeDrawerTab === cat.id ? 'active' : ''}`}
              onClick={() => handleTabChange(cat.id)}
            >
              {cat.shortName || cat.name}
            </button>
          ))}
          <button
            role="tab"
            aria-selected={activeDrawerTab === 'add-new'}
            className={`drawer-nav-tab new-tab ${activeDrawerTab === 'add-new' ? 'active' : ''}`}
            onClick={() => handleTabChange('add-new')}
          >
            <Plus size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            New Widget
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {activeDrawerTab === 'add-new' ? (
            /* Tab: Create New Custom Widget */
            <form onSubmit={handleCreateWidget} className="drawer-form" noValidate>
              <div className="form-group">
                <label htmlFor="widget-name-input">
                  Widget Name <span className="required">*</span>
                </label>
                <input
                  id="widget-name-input"
                  type="text"
                  placeholder="e.g. Cloud Storage Buckets"
                  value={widgetName}
                  onChange={(e) => {
                    setWidgetName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={errors.name ? 'input-error' : ''}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'widget-name-error' : undefined}
                />
                {errors.name && (
                  <span id="widget-name-error" className="error-message">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="widget-text-input">
                  Widget Text / Description <span className="required">*</span>
                </label>
                <textarea
                  id="widget-text-input"
                  rows={3}
                  placeholder="e.g. 5 Public Buckets | 12 Encrypted Buckets | 0 Exposed"
                  value={widgetText}
                  onChange={(e) => {
                    setWidgetText(e.target.value);
                    if (errors.text) setErrors((prev) => ({ ...prev, text: undefined }));
                  }}
                  className={errors.text ? 'input-error' : ''}
                  aria-invalid={!!errors.text}
                  aria-describedby={errors.text ? 'widget-text-error' : undefined}
                />
                {errors.text && (
                  <span id="widget-text-error" className="error-message">
                    {errors.text}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label id="category-selection-label">
                  Assign to Categories <span className="required">*</span>
                </label>
                {errors.categories && (
                  <span className="error-message">{errors.categories}</span>
                )}
                <div
                  className="category-checkbox-grid"
                  role="group"
                  aria-labelledby="category-selection-label"
                >
                  {state.categories.map((cat) => {
                    const isChecked = selectedCategoryIds.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`category-checkbox-card ${isChecked ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFormCategory(cat.id)}
                        />
                        <span className="checkbox-custom">
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span className="checkbox-label-text">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </form>
          ) : (
            /* Tab: Category Widgets Checkbox Management (PDF Page 2 & 3) */
            <div className="category-management-panel">
              <div className="section-instruction">
                <span>
                  Select widgets to display in <strong>{currentCategory?.name}</strong>:
                </span>
              </div>

              {primaryCategoryWidgets.length === 0 ? (
                <p className="no-widgets-category-msg">
                  No widgets currently configured for this category.
                </p>
              ) : (
                <div className="widget-checklist" role="group" aria-label="Category widgets">
                  {primaryCategoryWidgets.map((w) => (
                    <label
                      key={w.id}
                      className={`widget-checkbox-row ${w.isAssigned ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={w.isAssigned}
                        onChange={(e) =>
                          handleToggleWidgetAssignment(w, activeDrawerTab, e.target.checked)
                        }
                      />
                      <span className="checkbox-custom">
                        {w.isAssigned && <Check size={12} strokeWidth={3} />}
                      </span>
                      <div className="widget-item-info">
                        <span className="widget-item-name">{w.name}</span>
                        {w.text && <span className="widget-item-desc">{w.text}</span>}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Collapsible section to add widgets from other categories */}
              {otherAvailableWidgets.length > 0 && (
                <div className="other-widgets-section">
                  <button
                    type="button"
                    className="btn-toggle-other-widgets"
                    onClick={() => setShowOtherWidgets((prev) => !prev)}
                    aria-expanded={showOtherWidgets}
                  >
                    <span>Add widgets from other categories ({otherAvailableWidgets.length})</span>
                    {showOtherWidgets ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {showOtherWidgets && (
                    <div className="widget-checklist other-list">
                      {otherAvailableWidgets.map((w) => (
                        <label
                          key={w.id}
                          className={`widget-checkbox-row ${w.isAssigned ? 'checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={w.isAssigned}
                            onChange={(e) =>
                              handleToggleWidgetAssignment(w, activeDrawerTab, e.target.checked)
                            }
                          />
                          <span className="checkbox-custom">
                            {w.isAssigned && <Check size={12} strokeWidth={3} />}
                          </span>
                          <div className="widget-item-info">
                            <span className="widget-item-name">{w.name}</span>
                            {w.text && <span className="widget-item-desc">{w.text}</span>}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="drawer-inline-add">
                <button
                  type="button"
                  className="btn-link-add"
                  onClick={() => handleTabChange('add-new')}
                >
                  <Plus size={14} />
                  <span>Create a brand new widget for this category</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer matching PDF Page 2 & 3: Cancel and Confirm Buttons */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-cancel"
            onClick={handleClose}
          >
            Cancel
          </button>

          {activeDrawerTab === 'add-new' ? (
            <button
              type="button"
              className="btn-drawer-confirm"
              onClick={handleCreateWidget}
            >
              Add Widget
            </button>
          ) : (
            <button
              type="button"
              className="btn-drawer-confirm"
              onClick={() => {
                showNotification('Dashboard layout updated');
                handleClose();
              }}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </>
  );
}
