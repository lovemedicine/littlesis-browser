import { useState, useContext } from 'preact/hooks';
import { XMarkMiniSolid } from 'preact-heroicons';
import TextInput from './TextInput';
import RadioInput from './RadioInput';
import { Entity } from '@src/types';
import { createEntity } from '@src/api';
import { TokenContext } from '@src/util';

type Props = {
  onCreate: (entity: Entity) => any;
  closeForm: () => any;
  defaultName: string;
};

export default function CreateEntityForm({
  onCreate,
  closeForm,
  defaultName,
}: Props) {
  const [name, setName] = useState<string>(defaultName || '');
  const [blurb, setBlurb] = useState<string>('');
  const [type, setType] = useState<'person' | 'org' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const token = useContext(TokenContext);
  const canSubmit = type && name.length > 2;

  async function handleSubmit() {
    if (!token || !canSubmit) return;
    setIsSaving(true);
    const entity = await createEntity(token, { name, blurb, type });
    if (entity) onCreate(entity);
    setIsSaving(false);
  }

  return (
    <div className='dropdown-content top-8 z-50 max-h-96 w-full flex-col overflow-auto rounded-md bg-base-200 p-3 text-sm'>
      <div className='relative'>
        <strong>Create Entity</strong>
        <TextInput
          placeholder={'name'}
          value={name}
          setValue={setName}
          autoFocus={true}
        />

        <TextInput placeholder={'blurb'} value={blurb} setValue={setBlurb} />

        <RadioInput
          name='type'
          value={type}
          options={['person', 'org']}
          setValue={setType}
        />

        <div className='mt-2'>
          <button
            className='btn-neutral btn btn-sm'
            disabled={!canSubmit || isSaving}
            onClick={handleSubmit}
          >
            {!isSaving && 'Create'}
            {isSaving && (
              <span className='loading loading-spinner loading-sm relative ml-2'></span>
            )}
          </button>
        </div>

        <div
          className='absolute right-0 top-0 cursor-pointer'
          onClick={closeForm}
        >
          <XMarkMiniSolid className='h-5 w-5' />
        </div>
      </div>
    </div>
  );
}
