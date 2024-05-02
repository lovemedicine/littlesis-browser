type Props = {
  placeholder: string;
  value: any;
  setValue: (value: any) => any;
};

export default function TextInput({ placeholder, value, setValue }: Props) {
  function handleChange(event: any) {
    setValue(event.target.value);
  }

  return (
    <input
      type='text'
      className='input input-sm input-bordered mt-2 w-full'
      placeholder={placeholder}
      value={value}
      onInput={handleChange}
    />
  );
}
