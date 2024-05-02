import { useState, useEffect, useContext } from 'preact/hooks';
import EntityPicker from './EntityPicker';
import RelationshipPicker from './RelationshipPicker';
import { TokenContext, getPageInfo } from '@src/util';
import { createRelationship } from '@src/api';
import { Entity } from '@src/types';

type ValidationErrors = {
  [key: string]: string;
};

export default function AddRelationshipForm() {
  const token = useContext(TokenContext);
  const [entity1, setEntity1] = useState<Entity | null>(null);
  const [entity2, setEntity2] = useState<Entity | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description1, setDescription1] = useState<string>('');
  const [description2, setDescription2] = useState<string>('');
  const [isCurrent, setIsCurrent] = useState<'true' | 'false' | 'null' | null>(
    null
  );
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  useEffect(() => {
    async function setPageInfo() {
      const { url, title } = await getPageInfo();
      setUrl(url || '');
      setTitle(title || '');
    }

    setPageInfo();
  }, []);

  useEffect(() => {
    if (!entity1?.type || !entity2?.type) {
      setCategoryId(null);
    }
  }, [entity1?.type, entity2?.type]);

  useEffect(() => {
    validateData();
  }, [entity1, entity2, categoryId, isCurrent, url, title]);

  function handleDescription1Change(event: any) {
    setDescription1(event.target.value);
  }

  function handleDescription2Change(event: any) {
    setDescription2(event.target.value);
  }

  function handleIsCurrentChange(event: any) {
    setIsCurrent(event.target.value);
  }

  function handleStartDateChange(event: any) {
    setStartDate(event.target.value);
  }

  function handleEndDateChange(event: any) {
    setEndDate(event.target.value);
  }

  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }

  function handleTitleChange(event: any) {
    setTitle(event.target.value);
  }

  function validateData() {
    const errors: ValidationErrors = {};
    if (!entity1) errors.entity1 = 'Entity 1 is missing';
    if (!entity2) errors.entity2 = 'Entity 2 is missing';
    if (!categoryId) errors.categoryId = 'Relationship type is missing';
    if (isCurrent == null) errors.isCurrent = 'Past/current is missing';
    if (!url) errors.url = 'Source URL is missing';
    if (!title) errors.title = 'Source title is missing';
    setValidationErrors(errors);
  }

  async function handleSubmit() {
    if (!token) return null;

    setSuccessUrl(null);

    if (Object.keys(validationErrors).length > 0) {
      setShowValidationErrors(true);
      return null;
    } else {
      setShowValidationErrors(false);
    }

    const submitData = {
      relationship: {
        entity1_id: (entity1 as Entity).id,
        entity2_id: (entity2 as Entity).id,
        category_id: categoryId as number,
        description1,
        description2,
        is_current: JSON.parse(isCurrent as string),
        start_date: startDate,
        end_date: endDate,
      },
      reference: {
        url,
        name: title,
      },
    };

    const result = await createRelationship(token, submitData);
    if (!result) return null;
    setSuccessUrl(result.url);
  }

  return (
    <div className='w-full'>
      <div className='p-2'>
        <div className='text-xl'>Create Relationship</div>
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
          category={categoryId}
          setCategory={setCategoryId}
        />

        <input
          type='text'
          className='input input-sm input-bordered mt-2 w-full'
          placeholder='description 1'
          value={description1}
          onInput={handleDescription1Change}
        />
        <input
          type='text'
          className='input input-sm input-bordered mt-2 w-full'
          placeholder='description 2'
          value={description2}
          onInput={handleDescription2Change}
        />

        <div className='mt-2'>
          <input
            type='radio'
            name='is_current'
            id='yes-current'
            value='true'
            className='radio radio-xs'
            onChange={handleIsCurrentChange}
          />{' '}
          <label for='yes-current' className='text-sm'>
            current
          </label>
          &nbsp;&nbsp;&nbsp;
          <input
            type='radio'
            name='is_current'
            id='no-current'
            value='false'
            className='radio radio-xs'
            onChange={handleIsCurrentChange}
          />{' '}
          <label for='no-current' className='text-sm'>
            past
          </label>
          &nbsp;&nbsp;&nbsp;
          <input
            type='radio'
            name='is_current'
            id='unknown-current'
            value='null'
            className='radio radio-xs'
            onChange={handleIsCurrentChange}
          />{' '}
          <label for='unknown-current' className='text-sm'>
            unknown
          </label>
        </div>

        <input
          type='text'
          className='input input-sm input-bordered mt-2 w-full'
          placeholder='start date, eg: 2001-00-00'
          value={startDate}
          onInput={handleStartDateChange}
        />
        <input
          type='text'
          className='input input-sm input-bordered mt-2 w-full'
          placeholder='end date, eg: 2010-00-00'
          value={endDate}
          onInput={handleEndDateChange}
        />

        <input
          type='text'
          className='input input-sm input-bordered mt-2 w-full'
          placeholder='page url'
          value={url}
          onInput={handleUrlChange}
        />
        <input
          type='text'
          className='input input-sm input-bordered mt-2 w-full'
          placeholder='page title'
          value={title}
          onInput={handleTitleChange}
        />
      </div>

      <div className='absolute bottom-0 w-full p-2'>
        {showValidationErrors && (
          <div className='mt-2 text-error'>
            {Object.values(validationErrors).join(', ')}
          </div>
        )}
        {successUrl && (
          <div className='mt-2 text-success'>
            Sucess!{' '}
            <a href={successUrl} target='_blank'>
              {successUrl}
            </a>
          </div>
        )}
        <div className='mt-2 flex space-x-2'>
          <button className='btn btn-primary flex-1' onClick={handleSubmit}>
            Create
          </button>
          <button className='btn btn-secondary flex-none' disabled>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
