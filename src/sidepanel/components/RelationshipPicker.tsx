import { useState, useEffect } from 'preact/hooks';
import SelectInput from './SelectInput';
import { getAllowedCategories } from '@src/api';

type Props = {
  type1?: string;
  type2?: string;
  category: string;
  setCategory: (id: string) => any;
};

export default function RelationshipPicker({
  type1,
  type2,
  category,
  setCategory,
}: Props) {
  const [allowedCategories, setAllowedCategories] = useState<
    [string, string][]
  >([]);

  function setValue(value: any) {
    setCategory(value);
  }

  useEffect(() => {
    setAllowedCategories(getAllowedCategories(type1, type2));
  }, [type1, type2]);

  return (
    <SelectInput
      value={category}
      options={allowedCategories}
      setValue={setValue}
    />
  );
}
