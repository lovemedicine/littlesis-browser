import { useState, useContext } from 'preact/hooks';
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

  function handleNameChange(event: any) {
    setName(event.target.value);
  }

  function handleBlurbChange(event: any) {
    setBlurb(event.target.value);
  }

  function handleTypeChange(event: any) {
    setType(event.target.value);
  }

  async function handleSubmit() {
    if (!token || !canSubmit) return;
    const entity = await createEntity(token, { name, blurb, type });
    onCreate(entity);
  }

  return (
    <div className='dropdown-content bg-base-200 top-8 z-50 max-h-96 w-full flex-col overflow-auto rounded-md p-3 text-sm'>
      <div className='relative'>
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
        <strong>Create Entity</strong>
        <div className='mt-2'>
          <input
            className='input input-sm input-bordered w-full'
            type='text'
            placeholder='Name'
            defaultValue={defaultName}
            onChange={handleNameChange}
          />
        </div>
        <div className='mt-2'>
          <input
            className='input input-sm input-bordered w-full'
            type='text'
            placeholder='Short description'
            onChange={handleBlurbChange}
          />
        </div>
        <div className='mt-2'>
          <input
            type='radio'
            name='type'
            id='person-type'
            value='person'
            className='radio radio-xs'
            onChange={handleTypeChange}
          />{' '}
          <label for='person-type'>person</label>
          &nbsp;&nbsp;&nbsp;
          <input
            type='radio'
            name='type'
            id='org-type'
            value='org'
            className='radio radio-xs'
            onChange={handleTypeChange}
          />{' '}
          <label for='org-type'>org</label>
          <div className='mt-2'>
            <button
              className='btn btn-sm btn-neutral'
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
