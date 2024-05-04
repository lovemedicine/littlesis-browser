import { useState, useEffect } from 'preact/hooks';
import SelectInput from './SelectInput';

type CategoryOption = [string, string, [string, string]];

const categories: CategoryOption[] = [
  ['', 'type', ['any', 'any']],
  ['1', 'Position', ['person', 'any']],
  ['2', 'Education', ['person', 'org']],
  ['3', 'Membership', ['any', 'any']],
  ['4', 'Family', ['person', 'person']],
  ['5', 'Donation/Grant', ['any', 'any']],
  ['6', 'Service/Transaction', ['any', 'any']],
  ['7', 'Lobbying', ['any', 'any']],
  ['8', 'Social', ['person', 'person']],
  ['9', 'Professional', ['person', 'person']],
  ['10', 'Ownership', ['any', 'org']],
  ['11', 'Hierarchy', ['org', 'org']],
  ['12', 'Generic', ['any', 'any']],
];

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
    setAllowedCategories(
      type1 && type2
        ? categories
            .filter(cat => {
              const [t1, t2] = cat[2];
              return (
                (t1 === 'any' || t1 === type1) && (t2 === 'any' || t2 === type2)
              );
            })
            .map(cat => [cat[0], cat[1]])
        : []
    );
  }, [type1, type2]);

  return (
    <SelectInput
      placeholder='category'
      value={category}
      options={allowedCategories}
      disabled={Boolean(!type1 || !type2)}
      setValue={setValue}
    />
  );
}
