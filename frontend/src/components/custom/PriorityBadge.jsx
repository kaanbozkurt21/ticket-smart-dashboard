import { Badge } from '../ui/badge';

const priorityConfig = {
  low: {
    variant: 'secondary',
    label: 'Düşük',
  },
  medium: {
    variant: 'default',
    label: 'Orta',
  },
  high: {
    variant: 'destructive',
    label: 'Yüksek',
  },
};

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.medium;
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
