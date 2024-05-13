import EntityLink from './EntityLink';
import { Entity } from '@src/types';

type Props = {
  entity: Entity;
  onRemove: () => any;
};

export default function SelectedEntity({ entity, onRemove }: Props) {
  return (
    <button className='btn btn-sm flex h-auto max-h-12 max-w-full'>
      <span className='max-w-full flex-1 leading-normal'>
        <EntityLink entity={entity} />
      </span>
      <span onClick={onRemove} className='flex-none'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4'
        >
          <path d='M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z' />
        </svg>
      </span>
    </button>
  );
}
