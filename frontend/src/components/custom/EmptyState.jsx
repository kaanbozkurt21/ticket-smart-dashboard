import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'Hiçbir veri bulunamadı', 
  description = 'Buraya eklenecek herhangi bir öğe yok.',
  className 
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
};
