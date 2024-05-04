type Props = {
  placeholder: string;
  value: any;
  setValue: (value: any) => any;
  autoFocus?: boolean;
};

export default function TextInput({
  placeholder,
  value,
  setValue,
  autoFocus,
}: Props) {
  function handleChange(event: any) {
    setValue(event.target.value);
  }

  return (
    <input
      autoFocus={Boolean(autoFocus)}
      type='text'
      className='input input-sm input-bordered mt-2 w-full'
      placeholder={placeholder}
      value={value}
      onInput={handleChange}
    />
  );
}
