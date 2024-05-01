import { useState } from 'preact/hooks';
import SelectedEntity from './SelectedEntity';
import EntitySearchForm from './EntitySearchForm';
import { Entity } from '@src/types';

type Props = {
  placeholder: string;
  entity: Entity | null;
  setEntity: (entity: Entity | null) => any;
};

export default function EntityPicker({
  placeholder,
  entity,
  setEntity,
}: Props) {
  return (
    <div className='mt-2'>
      {entity && (
        <SelectedEntity entity={entity} onRemove={() => setEntity(null)} />
      )}
      {!entity && (
        <EntitySearchForm placeholder={placeholder} onSelect={setEntity} />
      )}
    </div>
  );
}
