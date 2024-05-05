type Props = {
  options: Array<[any, string]>;
  value: any;
  setValue: (value: any) => any;
};

export default function SelectInput({ options, value, setValue }: Props) {
  function handleChange(event: JSX.TargetedEvent<HTMLSelectElement, Event>) {
    const val = event.currentTarget.value;
    setValue(val === 'null' ? null : val);
  }

  return (
    <select
      required
      className='select select-bordered select-sm mt-2 w-full max-w-xs'
      onChange={handleChange}
    >
      {options.map(([optionValue, name]) => (
        <option
          selected={optionValue === value}
          value={optionValue}
          disabled={optionValue === ''}
        >
          {name}
        </option>
      ))}
    </select>
  );
}
