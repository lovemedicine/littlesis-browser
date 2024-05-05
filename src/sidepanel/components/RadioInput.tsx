type Props = {
  name: string;
  value: any;
  options: any[];
  labels?: string[];
  setValue: (value: any) => any;
};

export default function RadioInput({
  name,
  value,
  options,
  labels,
  setValue,
}: Props) {
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement, Event>) {
    setValue(event.currentTarget.value);
  }

  if (labels === undefined) labels = options;

  return (
    <div className='ml-1 mt-2'>
      {options.map((option, index) => (
        <span key={value}>
          <input
            type='radio'
            name={name}
            id={name + '-' + value}
            checked={value === option}
            value={option}
            className='radio radio-xs'
            onChange={handleChange}
          />{' '}
          <label for={name + '-' + value} className='text-sm'>
            {labels[index]}
          </label>
          &nbsp;&nbsp;&nbsp;
        </span>
      ))}
    </div>
  );
}
