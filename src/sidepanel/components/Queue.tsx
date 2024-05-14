import { XMarkMiniSolid } from 'preact-heroicons';

type Props = {
  onClose: () => any;
  queue: string;
  setQueue: (queue: string) => any;
};

export default function Queue({ onClose, queue, setQueue }: Props) {
  function handleChange(event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) {
    setQueue(event.currentTarget.value);
  }

  const example = [
    'Example:',
    '',
    'entity1',
    'Timothy R Barakett',
    'Kenneth I Chenault',
    'Mariano-Florentino Cuéllar',
    'Paul J Finnegan',
  ].join('\n');

  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 z-50 bg-base-100 p-2'>
      <div className='text-lg'>Queue</div>
      <div className='bold text-sm'>Supported fields: entity1, entity2</div>
      <textarea
        className='textarea-bordered textarea mt-2 h-96 w-full text-sm'
        value={queue}
        placeholder={example}
        onChange={handleChange}
      ></textarea>
      <div className='absolute right-2 top-2 cursor-pointer' onClick={onClose}>
        <XMarkMiniSolid className='h-5 w-5' />
      </div>
    </div>
  );
}
