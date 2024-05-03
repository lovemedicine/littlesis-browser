import PositionFields from './PositionFields';
import DonationFields from './DonationFields';

type Props = {
  categoryId: number;
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function ExtraFields({ categoryId, setExtraFields }: Props) {
  const Fields = {
    1: PositionFields,
    5: DonationFields,
  }[categoryId];

  if (!Fields) return null;

  return <Fields setExtraFields={setExtraFields} />;
}
