import { Badge } from '../ui/badge';

export const TagBadge = ({ tag }) => {
  return (
    <Badge variant="outline" className="text-xs">
      {tag}
    </Badge>
  );
};
