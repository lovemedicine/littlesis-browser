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
        className='textarea textarea-bordered mt-2 h-96 w-full text-sm'
        value={queue}
        placeholder={example}
        onChange={handleChange}
      ></textarea>
      <div className='absolute right-2 top-2 cursor-pointer' onClick={onClose}>
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
  );
}
