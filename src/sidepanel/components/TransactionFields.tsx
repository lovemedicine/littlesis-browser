import { useState, useEffect } from 'preact/hooks';
import TextInput from './TextInput';
import { parseNumberString } from '@src/util';
import { ExtraFieldsType } from './AddRelationshipForm';

type Props = {
  initValues: ExtraFieldsType;
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function TransactionFields({
  initValues,
  setExtraFields,
}: Props) {
  const [amount, setAmount] = useState<string>(initValues.amount ?? '');
  const [goods, setGoods] = useState<string>(initValues.goods || '');

  useEffect(() => {
    setExtraFields({
      amount: parseNumberString(amount),
      goods: goods || null,
    });
  }, [amount, goods]);

  return (
    <>
      <TextInput placeholder='amount' value={amount} setValue={setAmount} />
      <TextInput
        placeholder='goods/services'
        value={goods}
        setValue={setGoods}
      />
    </>
  );
}
