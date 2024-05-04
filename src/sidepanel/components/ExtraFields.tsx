import PositionFields from './PositionFields';
import EducationFields from './EducationFields';
import DonationFields from './DonationFields';
import { ExtraFieldsType } from './AddRelationshipForm';

type Props = {
  categoryId: string;
  initValues: { [key: string]: ExtraFieldsType };
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function ExtraFields({
  categoryId,
  initValues,
  setExtraFields,
}: Props) {
  const Fields = {
    1: PositionFields,
    2: EducationFields,
    5: DonationFields,
  }[categoryId];

  if (!Fields) return null;

  return (
    <Fields
      initValues={initValues[categoryId] || {}}
      setExtraFields={setExtraFields}
    />
  );
}
