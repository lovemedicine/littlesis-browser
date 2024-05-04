type Props = {
  options: Array<[any, string]>;
  value: any;
  setValue: (value: any) => any;
  disabled?: boolean;
  required?: boolean;
};

export default function SelectInput({
  options,
  value,
  setValue,
  disabled,
  required,
}: Props) {
  function handleChange(event: any) {
    const val = event.target.value;
    setValue(val === 'null' ? null : val);
  }

  return (
    <select
      required
      className='select select-bordered select-sm mt-2 w-full max-w-xs'
      // disabled={Boolean(disabled)}
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
