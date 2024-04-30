import { useState, useEffect } from 'preact/hooks';
import EntityPicker from './EntityPicker';
import RelationshipPicker from './RelationshipPicker';
import { Entity } from '@src/types';

export default function AddRelationshipForm() {
  const [entity1, setEntity1] = useState<Entity | null>(null);
  const [entity2, setEntity2] = useState<Entity | null>(null);
  const [category, setCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!entity1?.type || !entity2?.type) {
      setCategory(null);
    }
  }, [entity1?.type, entity2?.type]);

  return (
    <div className='p-2'>
      <div className='text-xl'>Add Relationship</div>

      <EntityPicker
        placeholder='Entity 1'
        entity={entity1}
        setEntity={setEntity1}
      />

      <EntityPicker
        placeholder='Entity 2'
        entity={entity2}
        setEntity={setEntity2}
      />

      <RelationshipPicker
        type1={entity1?.type}
        type2={entity2?.type}
        category={category}
        setCategory={setCategory}
      />
    </div>
  );
}
