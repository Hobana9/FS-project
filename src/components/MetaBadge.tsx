import { Badge } from '@mantine/core';
import type { Meta } from '../data/labels.ts';

type MetaBadgeProps = {
  meta: Meta;
};

function MetaBadge({ meta }: MetaBadgeProps) {
  return (
    <Badge color={meta.color} variant="light">
      {meta.label}
    </Badge>
  );
}

export default MetaBadge;
