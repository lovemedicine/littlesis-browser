import { Entity } from '@src/types';

type Props = {
  entities: Entity[];
  show: boolean;
  onSelect: (entity: Entity) => any;
  onShowCreateForm: () => any;
};

export default function EntitySearchResults({
  entities,
  show,
  onSelect,
  onShowCreateForm,
}: Props) {
  return (
    <div
      className={
        'dropdown-content top-8 z-10 max-h-96 w-full flex-col overflow-auto rounded-md bg-base-200' +
        (show ? '' : ' hidden')
      }
    >
      <ul className='menu-compact menu'>
        {!entities.length && (
          <div className='p-2'>
            <strong>No entities found.</strong>
          </div>
        )}
        {entities.map((entity, index) => {
          return (
            <li
              key={index}
              tabIndex={index + 1}
              onClick={() => {
                onSelect(entity);
              }}
              className='w-full border-b border-b-base-content/10'
            >
              <button title={entity.blurb}>
                <span className='w-full truncate'>
                  {entity.name}{' '}
                  <em className='text-sm text-slate-500'>{entity.blurb}</em>
                </span>
              </button>
            </li>
          );
        })}
        <li key={0} className='w-full border-b border-b-base-content/10'>
          <button onClick={onShowCreateForm}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4'
            >
              <path d='M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z' />
            </svg>
            Create entity
          </button>
        </li>
      </ul>
    </div>
  );
}
