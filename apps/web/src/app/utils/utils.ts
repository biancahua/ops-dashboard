export const getUrgencyColor = (urgency: number, source: 'page' | 'component') => {
  if (urgency >= 8) return source === 'page' ? 'red' : 'text-red-600 bg-red-50';
  if (urgency >= 5) return source === 'page' ? 'orange' : 'text-orange-600 bg-orange-50';
  return source === 'page' ? 'gold' : 'text-yellow-600 bg-yellow-50';
};

export const getUrgencyLabel = (urgency: number) => {
  if (urgency >= 8) return 'Critical';
  if (urgency >= 5) return 'High';
  return 'Medium';
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const formatFullTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'booked':
      return 'success';
    case 'blocked_needs_human':
      return 'error';
    case 'declined':
      return 'default';
    case 'active':
      return 'processing';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'booked':
      return 'Booked';
    case 'blocked_needs_human':
      return 'Needs Help';
    case 'declined':
      return 'Declined';
    case 'active':
      return 'Active';
    default:
      return 'Unknown';
  }
};

