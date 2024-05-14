import { XMarkMiniSolid } from 'preact-heroicons';
import EntityLink from './EntityLink';
import { Entity } from '@src/types';

type Props = {
  entity: Entity;
  onRemove: () => any;
};

export default function SelectedEntity({ entity, onRemove }: Props) {
  return (
    <button className='btn-neutral btn btn-sm flex h-auto max-h-12 max-w-full'>
      <span className='max-w-full flex-1 leading-normal'>
        <EntityLink entity={entity} />
      </span>
      <span onClick={onRemove} className='flex-none'>
        <XMarkMiniSolid className='h-4 w-4' />
      </span>
    </button>
  );
}
