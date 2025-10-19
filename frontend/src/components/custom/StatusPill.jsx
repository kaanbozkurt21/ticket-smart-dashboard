import { Badge } from '../ui/badge';

const statusConfig = {
  open: {
    variant: 'warning',
    label: 'Açık',
  },
  'in-progress': {
    variant: 'default',
    label: 'İşleniyor',
  },
  resolved: {
    variant: 'success',
    label: 'Çözüldü',
  },
  closed: {
    variant: 'secondary',
    label: 'Kapalı',
  },
};

export const StatusPill = ({ status }) => {
  const config = statusConfig[status] || statusConfig.open;
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
