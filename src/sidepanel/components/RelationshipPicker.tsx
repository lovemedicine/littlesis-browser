import { useState, useEffect } from 'preact/hooks';

type CategoryOption = [number, string, [string, string]];

const categories: CategoryOption[] = [
  [1, 'Position', ['person', 'any']],
  [2, 'Education', ['person', 'org']],
  [3, 'Membership', ['any', 'any']],
  [4, 'Family', ['person', 'person']],
  [5, 'Donation/Grant', ['any', 'any']],
  [6, 'Serviced/Transaction', ['any', 'any']],
  [7, 'Lobbying', ['any', 'any']],
  [8, 'Social', ['person', 'person']],
  [9, 'Professional', ['person', 'person']],
  [10, 'Ownership', ['any', 'org']],
  [11, 'Hierarchy', ['org', 'org']],
  [12, 'Generic', ['any', 'any']],
];

type Props = {
  type1?: string;
  type2?: string;
  category: number | null;
  setCategory: (id: number | null) => any;
};

export default function RelationshipPicker({
  type1,
  type2,
  category,
  setCategory,
}: Props) {
  const [allowedCategories, setAllowedCategories] = useState<CategoryOption[]>(
    []
  );

  useEffect(() => {
    setAllowedCategories(
      type1 && type2
        ? categories.filter(cat => {
            const [t1, t2] = cat[2];
            return (
              (t1 === 'any' || t1 === type1) && (t2 === 'any' || t2 === type2)
            );
          })
        : []
    );
  }, [type1, type2]);

  function handleCategoryChange(event: any) {
    setCategory(event.target.value);
  }

  return (
    <select
      className='select select-bordered select-sm mt-2 w-full max-w-xs'
      disabled={Boolean(!type1 || !type2)}
      onChange={handleCategoryChange}
    >
      <option selected={category === null} disabled>
        category
      </option>
      {allowedCategories.map(([id, categoryName]) => (
        <option selected={id === category} value={id}>
          {categoryName}
        </option>
      ))}
    </select>
  );
}
