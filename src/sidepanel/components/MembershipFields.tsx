import { useState, useEffect } from 'preact/hooks';
import TextInput from './TextInput';
import { ExtraFieldsType } from './AddRelationshipForm';

type Props = {
  initValues: ExtraFieldsType;
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function MembershipFields({
  initValues,
  setExtraFields,
}: Props) {
  const [title, setTitle] = useState<string>(initValues.description1 || '');

  useEffect(() => {
    setExtraFields({
      description1: title || null,
    });
  }, [title]);

  return (
    <>
      <TextInput placeholder='title' value={title} setValue={setTitle} />
    </>
  );
}
