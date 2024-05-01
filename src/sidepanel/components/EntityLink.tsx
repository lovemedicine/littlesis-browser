import { Entity } from '@src/types';

type Props = {
  entity: Entity;
};

export default function EntityLink({ entity }: Props) {
  return (
    <a
      href={entity.url}
      target='_blank'
      className='underline'
      title={entity.blurb}
    >
      {entity.name}
    </a>
  );
}
