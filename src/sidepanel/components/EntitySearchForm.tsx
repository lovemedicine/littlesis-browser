import { useState, useCallback, useEffect } from 'preact/hooks';
import { debounce } from '@github/mini-throttle';
import EntitySearchResults from './EntitySearchResults';
import CreateEntityForm from './CreateEntityForm';
import { Entity } from '@src/types';
import { searchForEntity } from '@src/api';
import { capitalize } from '@src/util';
import useHotkeys from '@src/useHotKeys';

type Props = {
  placeholder: string;
  defaultQuery: string;
  onSelect: (entity: Entity) => any;
};

export default function EntitySearchForm({
  placeholder,
  defaultQuery,
  onSelect,
}: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useHotkeys('enter', () => {
    if (entities.length > 0) {
      onSelect(entities[0]);
    } else {
      setShowCreateForm(true);
    }
  });

  const processQuery = useCallback(
    debounce(async (query: string) => {
      if (query.length === 0) {
        setShowCreateForm(false);
      } else {
        setEntities(await searchForEntity(query));
      }
    }, 200),
    []
  );

  useEffect(() => {
    processQuery(query);
  }, [query]);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  function handleInputChange(
    event: JSX.TargetedEvent<HTMLInputElement, Event>
  ) {
    setQuery(event.currentTarget.value);
  }

  return (
    <div
      className={'dropdown w-full' + (query.length > 1 ? ' dropdown-open' : '')}
    >
      <label className='input input-sm input-bordered flex items-center gap-2'>
        <input
          type='text'
          className='grow'
          placeholder={placeholder}
          value={query}
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
