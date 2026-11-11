import { getStatusColor } from '../../utils/helpers';

export default function StatusBadge({ status, showDot = true }) {
  const cls = getStatusColor(status);
  return (
    <span className={`badge badge-${cls} ${showDot ? 'badge-dot' : ''}`}>
      {status}
    </span>
  );
}
