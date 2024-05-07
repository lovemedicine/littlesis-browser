import SelectedEntity from './SelectedEntity';
import EntitySearchForm from './EntitySearchForm';
import { Entity } from '@src/types';

type Props = {
  placeholder: string;
  entity: Entity | null;
  entityQuery: string;
  setEntity: (entity: Entity | null) => any;
};

export default function EntityPicker({
  placeholder,
  entity,
  entityQuery,
  setEntity,
}: Props) {
  console.log(placeholder, 'picker query', entityQuery);

  return (
    <div className='mt-2'>
      {entity && (
        <SelectedEntity entity={entity} onRemove={() => setEntity(null)} />
      )}
      {!entity && (
        <EntitySearchForm
          placeholder={placeholder}
          defaultQuery={entityQuery}
          onSelect={setEntity}
        />
      )}
    </div>
  );
}
