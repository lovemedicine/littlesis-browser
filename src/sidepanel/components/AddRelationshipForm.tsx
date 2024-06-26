import { useState, useEffect, useContext } from 'preact/hooks';
import { ArrowsUpDownMiniSolid, ArrowPathMiniSolid } from 'preact-heroicons';
import EntityPicker from './EntityPicker';
import RelationshipPicker from './RelationshipPicker';
import TextInput from './TextInput';
import RadioInput from './RadioInput';
import ExtraFields from './ExtraFields';
import Queue from './Queue';
import {
  TokenContext,
  getPageInfo,
  nextQueueItem,
  countQueueItems,
} from '@src/util';
import {
  createRelationship,
  findSimilarRelationships,
  isAllowedCategory,
} from '@src/api';
import { validateDate } from '@src/validation';
import { Entity } from '@src/types';

type ValidationErrors = {
  [key: string]: string;
};

export type ExtraFieldsType = { [key: string]: any };

export default function AddRelationshipForm() {
  const token = useContext(TokenContext) as string;
  const [entity1Query, setEntity1Query] = useState('');
  const [entity2Query, setEntity2Query] = useState('');
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
  const [isSaving, setIsSaving] = useState(false);
  const [createRelationshipErrors, setCreateRelationshipErrors] = useState<
    string[] | null
  >(null);
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState<string>('');

  useEffect(() => {
    async function init() {
      await loadData();
      if (!url) await setPageInfo();
    }

    init();

    return saveData;
  }, []);

  useEffect(() => {
    if (!isAllowedCategory(entity1?.type, entity2?.type, categoryId)) {
      setCategoryId('');
    }
  }, [entity1?.type, entity2?.type]);

  useEffect(() => {
    validateData();
  }, [
    entity1?.id,
    entity2?.id,
    categoryId,
    isCurrent,
    startDate,
    endDate,
    url,
    title,
  ]);

  useEffect(() => {
    async function checkSimilarRelationships() {
      if (entity1?.id && entity2?.id && categoryId) {
        const data = await findSimilarRelationships(token, {
          entity1_id: entity1.id.toString(),
          entity2_id: entity2.id.toString(),
          category_id: categoryId.toString(),
        });

        setSimilarRelationshipUrls(data.map(rel => rel.url));
      } else {
        setSimilarRelationshipUrls([]);
      }
    }

    checkSimilarRelationships();
  }, [entity1?.id, entity2?.id, categoryId]);

  function validateData() {
    let errors: ValidationErrors = {};
    if (!entity1?.id) errors.entity1 = 'Entity 1 is missing';
    if (!entity2?.id) errors.entity2 = 'Entity 2 is missing';
    if (!categoryId) errors.categoryId = 'Relationship type is missing';
    if (isCurrent == null) errors.isCurrent = 'Past/current is missing';
    if (startDate && !validateDate(startDate))
      errors.startDate = 'Invalid start date';
    if (endDate && !validateDate(endDate)) errors.endDate = 'Invalid end date';
    if (!url) errors.url = 'Source URL is missing';
    if (url && !URL.canParse(url)) errors.url = 'Invalid source URL';
    if (!title) errors.title = 'Source title is missing';
    setValidationErrors(errors);
  }

  async function handleSubmit() {
    setSuccessUrl(null);
    setCreateRelationshipErrors(null);

    if (Object.keys(validationErrors).length > 0) {
      setShowValidationErrors(true);
      return null;
    } else {
      setShowValidationErrors(false);
    }

    setIsSaving(true);

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
    setIsSaving(false);

    if ('error' in result) {
      setCreateRelationshipErrors(result.error);
      return;
    }

    setSuccessUrl(result.url);
    applyQueueItem();
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
    queue,
  ]);

  async function setPageInfo() {
    let url, title;

    try {
      ({ url, title } = await getPageInfo());
    } catch (error) {}

    setUrl(url || '');
    setTitle(title || '');
  }

  function swapEntities() {
    const entity1Copy = entity1;
    setEntity1(entity2);
    setEntity2(entity1Copy);
  }

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
      queue,
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
      setQueue(data.queue);
    }
  }

  function handleReset() {
    setEntity1Query('');
    setEntity2Query('');
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
    setCreateRelationshipErrors(null);
  }

  function handleSetExtraFields(fields: ExtraFieldsType) {
    if (categoryId) {
      setExtraFields({ ...extraFields, [categoryId]: fields });
    }
  }

  function openQueue() {
    setShowQueue(true);
  }

  function closeQueue() {
    setShowQueue(false);
  }

  function applyQueueItem() {
    const [newQueue, item] = nextQueueItem(queue);

    if (!item) return;

    Object.entries(item).forEach(([key, value]) => {
      switch (key) {
        case 'entity1':
          setEntity1(null);
          setEntity1Query(value);
          break;
        case 'entity2':
          setEntity2(null);
          setEntity2Query(value);
          break;
      }
    });

    setQueue(newQueue);
  }

  const showDescriptionInputs = ['4', '6', '8', '9', '12'].includes(categoryId);
  const queueNum = countQueueItems(queue);

  return (
    <div className='w-full'>
      <div className='w-full p-2'>
        <div className='flex w-full space-x-2'>
          <div
            className='flex-1'
            style={{
              maxWidth: entity1 && entity2 ? 'calc(100% - 3rem)' : '100%',
            }}
          >
            <EntityPicker
              placeholder='entity 1'
              entity={entity1}
              entityQuery={entity1Query}
              setEntity={setEntity1}
            />

            <EntityPicker
              placeholder='entity 2'
              entity={entity2}
              entityQuery={entity2Query}
              setEntity={setEntity2}
            />
          </div>
          {entity1 && entity2 && (
            <div className='my-auto w-8 flex-none'>
              <button
                className='btn-outline btn input-bordered btn-sm btn-circle'
                onClick={swapEntities}
                title='swap entities'
              >
                <ArrowsUpDownMiniSolid className='h-5 w-5' />
              </button>
            </div>
          )}
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
              className='btn-outline btn input-bordered btn-sm btn-circle'
              onClick={setPageInfo}
              title='update page url and title'
            >
              <ArrowPathMiniSolid className='h-5 w-5' />
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
          <ul className='mt-2 text-error'>
            {Object.values(validationErrors).map(error => (
              <li>{error}</li>
            ))}
          </ul>
        )}

        {createRelationshipErrors && (
          <ul className='mt-2 text-error'>
            {createRelationshipErrors.map(error => (
              <li>{error}</li>
            ))}
          </ul>
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
          <button
            className='text-md btn-primary btn flex-1'
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {!isSaving && 'Create'}
            {isSaving && (
              <span className='loading loading-spinner loading-sm relative ml-2'></span>
            )}
          </button>
          <button
            className='text-md btn-secondary btn flex-none'
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className='text-md btn-accent btn flex-none'
            onClick={openQueue}
          >
            Queue ({queueNum})
          </button>
          <button
            className='text-md btn-accent btn flex-none'
            onClick={applyQueueItem}
            disabled={queueNum < 1}
          >
            Next
          </button>
        </div>
      </div>
      {showQueue && (
        <Queue onClose={closeQueue} queue={queue} setQueue={setQueue} />
      )}
    </div>
  );
}
