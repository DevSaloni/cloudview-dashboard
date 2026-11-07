import { Plus } from 'lucide-react';
import WidgetCard from './WidgetCard';
import useDashboard from '../hooks/useDashboard';

export default function CategorySection({ category }) {
  const { openDrawerWithCategory, searchQuery } = useDashboard();
  const isSearching = searchQuery.trim().length > 0;

  return (
    <section className="category-section" aria-labelledby={`heading-${category.id}`}>
      <div className="category-header">
        <h2 id={`heading-${category.id}`} className="category-title">
          {category.name}
        </h2>
        <span className="category-count">
          {category.widgets.length} {category.widgets.length === 1 ? 'widget' : 'widgets'}
        </span>
      </div>

      <div className="widget-grid">
        {category.widgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            categoryId={category.id}
          />
        ))}

        {/* Empty placeholder card to add a widget directly to this category (visible when not searching) */}
        {!isSearching && (
          <button
            type="button"
            className="add-widget-card"
            onClick={() => openDrawerWithCategory(category.id)}
            aria-label={`Add widget to ${category.name}`}
          >
            <div className="add-widget-card-inner">
              <Plus size={16} />
              <span>Add Widget</span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
