import { useState, useContext } from 'preact/hooks';
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
  const token = useContext(TokenContext);
  const canSubmit = type && name.length > 2;

  async function handleSubmit() {
    if (!token || !canSubmit) return;
    const entity = await createEntity(token, { name, blurb, type });
    if (entity) onCreate(entity);
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
            className='btn btn-neutral btn-sm'
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>

        <div
          className='absolute right-0 top-0 cursor-pointer'
          onClick={closeForm}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-5 w-5'
          >
            <path d='M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z' />
          </svg>
        </div>
      </div>
    </div>
  );
}
