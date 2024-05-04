import PositionFields from './PositionFields';
import EducationFields from './EducationFields';
import MembershipFields from './MembershipFields';
import DonationFields from './DonationFields';
import TransactionFields from './TransactionFields';
import OwnershipFields from './OwnershipFIelds';
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
    3: MembershipFields,
    5: DonationFields,
    6: TransactionFields,
    10: OwnershipFields,
  }[categoryId];

  if (!Fields) return null;

  return (
    <Fields
      initValues={initValues[categoryId] || {}}
      setExtraFields={setExtraFields}
    />
  );
}
