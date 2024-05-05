import { useState, useEffect, useContext } from 'preact/hooks';
import EntityPicker from './EntityPicker';
import RelationshipPicker from './RelationshipPicker';
import TextInput from './TextInput';
import ExtraFields from './ExtraFields';
import { TokenContext, getPageInfo } from '@src/util';
import {
  createRelationship,
  findSimilarRelationships,
  isAllowedCategory,
} from '@src/api';
import { Entity } from '@src/types';
import RadioInput from './RadioInput';
import { start } from 'repl';

type ValidationErrors = {
  [key: string]: string;
};

export type ExtraFieldsType = { [key: string]: any };

export default function AddRelationshipForm() {
  const token = useContext(TokenContext) as string;
  const [entity1, setEntity1] = useState<Entity | null>(null);
  const [entity2, setEntity2] = useState<Entity | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');
  const [description1, setDescription1] = useState<string>('');
  const [description2, setDescription2] = useState<string>('');
  const [isCurrent, setIsCurrent] = useState<'yes' | 'no' | 'null'>('null');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [extraFields, setExtraFields] = useState<{
    [key: string]: ExtraFieldsType;
  }>({});
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
    async function init() {
      await loadData();
      if (!url) await setPageInfo();
    }

    init();

    return saveData;
  }, []);

  useEffect(() => {
    if (
      !entity1?.type ||
      !entity2?.type ||
      !isAllowedCategory(entity1?.type, entity2?.type, categoryId)
    ) {
      setCategoryId('');
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

  async function setPageInfo() {
    const { url, title } = await getPageInfo();
    setUrl(url || '');
    setTitle(title || '');
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
        category_id: categoryId,
        description1: description1 || null,
        description2: description2 || null,
        is_current: isCurrent,
        start_date: startDate || null,
        end_date: endDate || null,
        ...(extraFields[categoryId] || {}),
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

  function swapEntities() {
    const entity1Copy = entity1;
    setEntity1(entity2);
    setEntity2(entity1Copy);
  }

  useEffect(() => {
    saveData();
  }, [
    entity1?.id,
    entity2?.id,
    categoryId,
    description1,
    description2,
    isCurrent,
    startDate,
    endDate,
    JSON.stringify(extraFields),
    similarRelationshipUrls.join(','),
  ]);

  function saveData() {
    const data = {
      entity1,
      entity2,
      categoryId,
      description1,
      description2,
      isCurrent,
      startDate,
      endDate,
      extraFields,
      similarRelationshipUrls,
    };
    chrome.storage.sync.set({
      relationshipData: data,
    });
  }

  async function getStoredData() {
    const { relationshipData } =
      await chrome.storage.sync.get('relationshipData');
    return relationshipData;
  }

  async function loadData() {
    const data = await getStoredData();

    if (data) {
      setEntity1(data.entity1);
      setEntity2(data.entity2);
      setCategoryId(data.categoryId);
      setDescription1(data.description1);
      setDescription2(data.description2);
      setIsCurrent(data.isCurrent);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setExtraFields(data.extraFields);
      setSimilarRelationshipUrls(data.similarRelationshipUrls);
    }
  }

  function handleReset() {
    setEntity1(null);
    setEntity2(null);
    setCategoryId('');
    setDescription1('');
    setDescription2('');
    setIsCurrent('null');
    setStartDate('');
    setEndDate('');
    setExtraFields({});
    setValidationErrors({});
    setShowValidationErrors(false);
    setSuccessUrl(null);
  }

  function handleSetExtraFields(fields: ExtraFieldsType) {
    if (categoryId) {
      setExtraFields({ ...extraFields, [categoryId]: fields });
    }
  }

  const showDescriptionInputs = ['4', '6', '8', '9', '12'].includes(categoryId);

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
                className='btn btn-circle btn-outline input-bordered btn-sm'
                onClick={swapEntities}
                title='swap entities'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='h-5 w-5'
                >
                  <path
                    fillRule='evenodd'
                    d='M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z'
                    clipRule='evenodd'
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

        {showDescriptionInputs && (
          <>
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
          </>
        )}

        {categoryId && (
          <ExtraFields
            categoryId={categoryId}
            initValues={extraFields}
            setExtraFields={handleSetExtraFields}
          />
        )}

        <RadioInput
          name='is_current'
          value={isCurrent}
          options={['yes', 'no', 'null']}
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

        <div className='flex space-x-2'>
          <div className='flex-1'>
            <TextInput placeholder='source url' value={url} setValue={setUrl} />
            <TextInput
              placeholder='source title'
              value={title}
              setValue={setTitle}
            />
          </div>
          <div className='my-auto flex-none'>
            <button
              className='btn btn-circle btn-outline input-bordered btn-sm'
              onClick={setPageInfo}
              title='update page url and title'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='h-5 w-5'
              >
                <path
                  fillRule='evenodd'
                  d='M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
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
