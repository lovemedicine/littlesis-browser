import { useState, useCallback, useEffect } from 'preact/hooks';
import { debounce } from '@github/mini-throttle';
import { MagnifyingGlassMiniSolid } from 'preact-heroicons';
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
      <label className='input-bordered input input-sm flex items-center gap-2'>
        <input
          type='text'
          className='grow'
          placeholder={placeholder}
          value={query}
          onInput={handleInputChange}
        />
        <MagnifyingGlassMiniSolid className='h-4 w-4 opacity-70' />
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
