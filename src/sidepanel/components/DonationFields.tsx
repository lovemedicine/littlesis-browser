import { useState, useEffect } from 'preact/hooks';
import TextInput from './TextInput';
import { parseNumberString } from '@src/util';
import { ExtraFieldsType } from './AddRelationshipForm';

type Props = {
  initValues: ExtraFieldsType;
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function DonationFields({ initValues, setExtraFields }: Props) {
  const [type, setType] = useState<string>(initValues.description1 || '');
  const [amount, setAmount] = useState<string>(initValues.amount ?? '');

  useEffect(() => {
    setExtraFields({
      description1: type || null,
      amount: parseNumberString(amount),
    });
  }, [amount]);

  return (
    <>
      <TextInput placeholder='type' value={type} setValue={setType} />
      <TextInput placeholder='amount' value={amount} setValue={setAmount} />
    </>
  );
}
