import { BarChart3 } from 'lucide-react';

export default function EmptyState({ message = 'No Graph data available!' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <BarChart3 size={42} strokeWidth={1.5} />
      </div>
      <p className="empty-state-text">{message}</p>
    </div>
  );
}
