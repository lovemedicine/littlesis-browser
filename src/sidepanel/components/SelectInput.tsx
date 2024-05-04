type Props = {
  placeholder: string;
  options: Array<[any, string]>;
  value: any;
  setValue: (value: any) => any;
  disabled?: boolean;
};

export default function SelectInput({
  placeholder,
  options,
  value,
  setValue,
  disabled,
}: Props) {
  function handleChange(event: any) {
    const val = event.target.value;
    setValue(val === 'null' ? null : val);
  }

  return (
    <select
      className='select select-bordered select-sm mt-2 w-full max-w-xs'
      disabled={Boolean(disabled)}
      onChange={handleChange}
    >
      {options.map(([optionValue, name]) => (
        <option selected={optionValue === value} value={optionValue}>
          {name}
        </option>
      ))}
    </select>
  );
}
