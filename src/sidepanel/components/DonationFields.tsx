import { useState, useEffect } from 'preact/hooks';
import TextInput from './TextInput';
import { parseNumberString } from '@src/util';

type Props = {
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function DonationFields({ setExtraFields }: Props) {
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    setExtraFields({ amount: parseNumberString(amount) });

    return () => {
      setExtraFields({});
    };
  }, [amount]);

  return <TextInput placeholder='amount' value={amount} setValue={setAmount} />;
}
