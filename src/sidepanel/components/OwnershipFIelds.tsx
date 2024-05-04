import { useState, useEffect } from 'preact/hooks';
import TextInput from './TextInput';
import { parseNumberString } from '@src/util';
import { ExtraFieldsType } from './AddRelationshipForm';

type Props = {
  initValues: ExtraFieldsType;
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function OwnershipFields({ initValues, setExtraFields }: Props) {
  const {
    description1: initDescription,
    ownership_attributes: initAttributes,
  } = initValues;
  const [description, setDescription] = useState<string>(initDescription || '');
  const [percentStake, setPercentStake] = useState<string>(
    initAttributes?.percent_stake ?? ''
  );
  const [shares, setShares] = useState<string>(initAttributes?.shares ?? '');

  useEffect(() => {
    setExtraFields({
      description1: description || null,
      ownership_attributes: {
        percent_stake: percentStake ? parseInt(percentStake) : null,
        shares: parseNumberString(shares),
      },
    });
  }, [description, percentStake, shares]);

  return (
    <>
      <TextInput
        placeholder='description'
        value={description}
        setValue={setDescription}
      />
      <TextInput
        placeholder='percent stake'
        value={percentStake}
        setValue={setPercentStake}
      />
      <TextInput placeholder='shares' value={shares} setValue={setShares} />
    </>
  );
}
