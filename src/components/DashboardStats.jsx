import { Layers, LayoutGrid, Puzzle } from 'lucide-react';
import useDashboard from '../hooks/useDashboard';

export default function DashboardStats() {
  const { totalCategories, totalAssignments, totalUniqueWidgets } = useDashboard();

  const stats = [
    {
      icon: Layers,
      label: 'Total Categories',
      value: totalCategories,
      color: 'blue',
      description: 'Active security domains',
    },
    {
      icon: LayoutGrid,
      label: 'Total Widget Assignments',
      value: totalAssignments,
      color: 'green',
      description: 'Across all dashboard views',
    },
    {
      icon: Puzzle,
      label: 'Total Unique Widgets',
      value: totalUniqueWidgets,
      color: 'purple',
      description: 'Custom & built-in modules',
    },
  ];

  return (
    <div className="stats-row" role="region" aria-label="Dashboard Summary Statistics">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className={`stat-icon ${stat.color}`}>
            <stat.icon size={22} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
            <span className="stat-desc">{stat.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
