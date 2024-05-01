import { useState, useMemo, useRef } from 'preact/hooks';
import { debounce } from '@github/mini-throttle';
import EntitySearchResults from './EntitySearchResults';
import CreateEntityForm from './CreateEntityForm';
import { Entity } from '@src/types';
import { searchForEntity } from '@src/api';
import { capitalize } from '@src/util';

type Props = {
  placeholder: string;
  onSelect: (entity: Entity) => any;
};

export default function EntitySearchForm({ placeholder, onSelect }: Props) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleInputChange = useMemo(() => {
    return debounce(async (event: any) => {
      const query = event.target.value.trim();
      setEntities(await searchForEntity(query));
      setQuery(query);
      if (query.length === 0) setShowCreateForm(false);
    }, 200);
  }, []);

  return (
    <div
      className={'dropdown w-full' + (query.length > 1 ? ' dropdown-open' : '')}
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

      <EntitySearchResults
        entities={entities}
        show={query.length > 1 && !showCreateForm}
        onSelect={onSelect}
        onShowCreateForm={() => setShowCreateForm(true)}
      />

      {query.length > 1 && showCreateForm && (
        <CreateEntityForm
          onCreate={onSelect}
          closeForm={() => setShowCreateForm(false)}
          defaultName={capitalize(query)}
        />
      )}
    </div>
  );
}
