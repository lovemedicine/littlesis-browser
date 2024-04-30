import { useState, useMemo, useRef } from 'preact/hooks';
import { debounce } from '@github/mini-throttle';
import { Entity } from '@src/types';
import { searchForEntity } from '@src/api';

type Props = {
  placeholder: string;
  onSelect: (entity: Entity) => any;
};

export default function EntitySearchForm({ placeholder, onSelect }: Props) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleInputChange = useMemo(() => {
    return debounce(async (event: any) => {
      const query = event.target.value.trim();
      setEntities(await searchForEntity(query));
      setOpen(query.length > 1);
    }, 200);
  }, []);

  return (
    <div
      className={'dropdown w-full' + (open ? ' dropdown-open' : '')}
      ref={ref}
    >
      <label className='input input-sm input-bordered flex items-center gap-2'>
        <input
          type='text'
          className='grow'
          placeholder={placeholder}
          onInput={handleInputChange}
        />
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 opacity-70'
        >
          <path
            fillRule='evenodd'
            d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
            clipRule='evenodd'
          />
        </svg>
      </label>

      <div
        className={
          'dropdown-content bg-base-200 top-8 z-50 max-h-96 w-full flex-col overflow-auto rounded-md' +
          (open ? '' : ' hidden')
        }
      >
        <ul className='menu menu-compact'>
          {!entities.length && (
            <div className='p-2'>
              <strong>No entities found.</strong>
            </div>
            // <li key={0} className='border-b-base-content/10 w-full border-b'>
            //   <button>
            //     <strong>No entities found.</strong>
            //   </button>
            // </li>
          )}
          {entities.map((entity, index) => {
            return (
              <li
                key={index}
                tabIndex={index + 1}
                onClick={() => {
                  onSelect(entity);
                }}
                className='border-b-base-content/10 w-full border-b'
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
          <li key={0} className='border-b-base-content/10 w-full border-b'>
            <button>
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
    </div>
  );
}
