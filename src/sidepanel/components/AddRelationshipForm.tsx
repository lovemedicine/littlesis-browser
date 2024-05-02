import { useState, useEffect, useContext } from 'preact/hooks';
import EntityPicker from './EntityPicker';
import RelationshipPicker from './RelationshipPicker';
import TextInput from './TextInput';
import { TokenContext, getPageInfo } from '@src/util';
import { createRelationship, findSimilarRelationships } from '@src/api';
import { Entity } from '@src/types';
import RadioInput from './RadioInput';

type ValidationErrors = {
  [key: string]: string;
};

export default function AddRelationshipForm() {
  const token = useContext(TokenContext) as string;
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
  const [similarRelationshipUrls, setSimilarRelationshipUrls] = useState<
    string[]
  >([]);

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
    setSuccessUrl(null);
    validateData();
  }, [entity1, entity2, categoryId, isCurrent, url, title]);

  useEffect(() => {
    async function checkSimilarRelationships() {
      if (entity1?.id && entity2?.id && categoryId) {
        const data = await findSimilarRelationships(token, {
          entity1_id: entity1.id.toString(),
          entity2_id: entity2.id.toString(),
          category_id: categoryId.toString(),
        });

        setSimilarRelationshipUrls((data || []).map(rel => rel.url));
      }
    }

    checkSimilarRelationships();
  }, [entity1?.id, entity2?.id, categoryId]);

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
        description1: description1 || null,
        description2: description2 || null,
        is_current: JSON.parse(isCurrent as string),
        start_date: startDate || null,
        end_date: endDate || null,
      },
      reference: {
        url: url,
        name: title,
      },
    };

    const result = await createRelationship(token, submitData);
    if (!result) return null;
    setSuccessUrl(result.url);
  }

  function handleReset() {
    setEntity1(null);
    setEntity2(null);
    setCategoryId(null);
    setDescription1('');
    setDescription2('');
    setIsCurrent(null);
    setStartDate('');
    setEndDate('');
    setValidationErrors({});
    setShowValidationErrors(false);
    setSuccessUrl(null);
  }

  function swapEntities() {
    const entity1Copy = entity1;
    setEntity1(entity2);
    setEntity2(entity1Copy);
  }

  return (
    <div className='w-full'>
      <div className='p-2'>
        <div className='text-xl'>Create Relationship</div>
        <div className='flex space-x-2'>
          <div className='flex-1'>
            <EntityPicker
              placeholder='entity 1'
              entity={entity1}
              setEntity={setEntity1}
            />

            <EntityPicker
              placeholder='entity 2'
              entity={entity2}
              setEntity={setEntity2}
            />
          </div>
          <div className='my-auto flex-none'>
            {entity1 && entity2 && (
              <button
                className='btn btn-circle'
                onClick={swapEntities}
                title='swap entities'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <RelationshipPicker
          type1={entity1?.type}
          type2={entity2?.type}
          category={categoryId}
          setCategory={setCategoryId}
        />

        <TextInput
          placeholder='description 1'
          value={description1}
          setValue={setDescription1}
        />

        <TextInput
          placeholder='description 2'
          value={description2}
          setValue={setDescription2}
        />

        <RadioInput
          name='is_current'
          value={isCurrent}
          options={['true', 'false', 'null']}
          labels={['present', 'past', 'unknown']}
          setValue={setIsCurrent}
        />

        <TextInput
          placeholder='start date'
          value={startDate}
          setValue={setStartDate}
        />

        <TextInput
          placeholder='end date'
          value={endDate}
          setValue={setEndDate}
        />

        <TextInput placeholder='source url' value={url} setValue={setUrl} />

        <TextInput
          placeholder='source title'
          value={title}
          setValue={setTitle}
        />
      </div>

      <div className='absolute bottom-0 w-full p-2'>
        {similarRelationshipUrls.length > 0 && (
          <div className='mt-2 text-error'>
            Similar relationships:
            {similarRelationshipUrls.map(relUrl => (
              <div>
                <a href={relUrl} target='_blank'>
                  {relUrl}
                </a>
              </div>
            ))}
          </div>
        )}

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
          <button className='btn btn-secondary flex-none' onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
