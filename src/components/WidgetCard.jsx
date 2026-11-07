import { X } from 'lucide-react';
import useDashboard from '../hooks/useDashboard';
import EmptyState from './EmptyState';

// ---- Donut Chart Component ----
function DonutChartAccounts({ data }) {
  const connected = data.connected ?? 2;
  const notConnected = data.notConnected ?? 2;
  const total = data.total ?? connected + notConnected;
  const pctConnected = total > 0 ? (connected / total) * 100 : 50;

  return (
    <div className="donut-container">
      <div
        className="donut-chart"
        style={{
          background: `conic-gradient(#3b82f6 0% ${pctConnected}%, #e2e8f0 ${pctConnected}% 100%)`,
        }}
      >
        <div className="donut-center">
          <span className="donut-center-value">{total}</span>
          <span className="donut-center-label">Total</span>
        </div>
      </div>
      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#3b82f6' }} />
          <span>Connected ({connected})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#cbd5e1' }} />
          <span>Not Connected ({notConnected})</span>
        </div>
      </div>
    </div>
  );
}

function DonutChartRisk({ data }) {
  const failed = data.failed ?? 1689;
  const warning = data.warning ?? 681;
  const notAvailable = data.notAvailable ?? 36;
  const passed = data.passed ?? 7253;
  const total = data.total ?? failed + warning + notAvailable + passed;

  const pctFailed = (failed / total) * 100;
  const pctWarning = (warning / total) * 100;
  const pctNA = (notAvailable / total) * 100;

  const p1 = pctFailed;
  const p2 = p1 + pctWarning;
  const p3 = p2 + pctNA;

  const gradient = `conic-gradient(
    #ef4444 0% ${p1}%,
    #f59e0b ${p1}% ${p2}%,
    #94a3b8 ${p2}% ${p3}%,
    #10b981 ${p3}% 100%
  )`;

  return (
    <div className="donut-container">
      <div className="donut-chart" style={{ background: gradient }}>
        <div className="donut-center">
          <span className="donut-center-value">{total}</span>
          <span className="donut-center-label">Total</span>
        </div>
      </div>
      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#ef4444' }} />
          <span>Failed ({failed})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }} />
          <span>Warning ({warning})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#94a3b8' }} />
          <span>Not available ({notAvailable})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }} />
          <span>Passed ({passed})</span>
        </div>
      </div>
    </div>
  );
}

// ---- Stacked Horizontal Bar Chart Component (Registry Scan) ----
function StackedBarChart({ data }) {
  const total = data.total ?? 0;
  const totalLabel = data.totalLabel ?? 'Total Items';
  const segments = data.segments ?? [];
  const sumValues = segments.reduce((acc, seg) => acc + seg.value, 0) || 1;

  return (
    <div className="stacked-bar-container">
      <div className="stacked-bar-header">
        <span className="stacked-bar-total">{total}</span>
        <span className="stacked-bar-label">{totalLabel}</span>
      </div>

      <div className="stacked-bar-track">
        {segments.map((seg, idx) => {
          const widthPct = (seg.value / sumValues) * 100;
          return (
            <div
              key={idx}
              className="stacked-bar-fill"
              style={{
                width: `${widthPct}%`,
                backgroundColor: seg.color,
              }}
              title={`${seg.label}: ${seg.value}`}
            />
          );
        })}
      </div>

      <div className="stacked-bar-legend">
        {segments.map((seg, idx) => (
          <div className="legend-item" key={idx}>
            <span className="legend-dot" style={{ background: seg.color }} />
            <span>
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Circular Gauge Component ----
function CircularProgressChart({ data }) {
  const resolved = data.resolved ?? 87;
  const pending = data.pending ?? 13;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (resolved / 100) * circumference;

  return (
    <div className="circular-container">
      <div className="circular-progress">
        <svg width="86" height="86" viewBox="0 0 86 86">
          <circle cx="43" cy="43" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="43"
            cy="43"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="circular-progress-text">{resolved}%</div>
      </div>
      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#3b82f6' }} />
          <span>Resolved ({resolved}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#cbd5e1' }} />
          <span>Pending ({pending}%)</span>
        </div>
      </div>
    </div>
  );
}

// ---- Badge Indicators Component ----
function BadgeChart({ data }) {
  const { critical = 0, high = 0, medium = 0, low = 0 } = data;
  const badges = [
    { label: 'Critical', value: critical, cls: 'critical' },
    { label: 'High', value: high, cls: 'high' },
    { label: 'Medium', value: medium, cls: 'medium' },
    { label: 'Low', value: low, cls: 'low' },
  ];

  return (
    <div className="ticket-badges-container">
      <div className="badge-grid">
        {badges.map((b) => (
          <div key={b.label} className={`ticket-badge ${b.cls}`}>
            <span className="badge-number">{b.value}</span>
            <span className="badge-text">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Main WidgetCard Component ----
export default function WidgetCard({ widget, categoryId }) {
  const { dispatch, showNotification } = useDashboard();

  const handleRemove = () => {
    dispatch({
      type: 'REMOVE_WIDGET',
      payload: { widgetId: widget.id, categoryId },
    });
    showNotification(`"${widget.name}" removed from this category`);
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'donut-accounts':
        return <DonutChartAccounts data={widget.data || {}} />;
      case 'donut-risk':
        return <DonutChartRisk data={widget.data || {}} />;
      case 'stacked-bar':
        return <StackedBarChart data={widget.data || {}} />;
      case 'circular':
        return <CircularProgressChart data={widget.data || {}} />;
      case 'badge':
        return <BadgeChart data={widget.data || {}} />;
      case 'empty':
        return <EmptyState message={widget.text || 'No Graph data available!'} />;
      default:
        // User created or custom text widget
        return (
          <div className="custom-widget-content">
            <p className="custom-widget-text">{widget.text}</p>
          </div>
        );
    }
  };

  return (
    <div className="widget-card">
      <div className="widget-card-header">
        <h3 className="widget-card-title">{widget.name}</h3>
        <button
          className="widget-remove-btn"
          onClick={handleRemove}
          title="Remove widget"
          aria-label={`Remove ${widget.name}`}
        >
          <X size={15} />
        </button>
      </div>

      <div className="widget-card-body">{renderContent()}</div>
    </div>
  );
}
