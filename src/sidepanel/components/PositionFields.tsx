import { useState, useEffect } from 'preact/hooks';
import RadioInput from './RadioInput';
import TextInput from './TextInput';
import { ExtraFieldsType } from './AddRelationshipForm';

type Props = {
  initValues: ExtraFieldsType;
  setExtraFields: (values: ExtraFieldsType) => any;
};

export default function PositionFields({ initValues, setExtraFields }: Props) {
  const { description1: initTitle, position_attributes: initAttributes } =
    initValues;
  const [title, setTitle] = useState<string>(initTitle || '');
  const [isBoard, setIsBoard] = useState<'yes' | 'no' | 'null'>(
    initAttributes?.is_board || 'null'
  );
  const [isExecutive, setIsExecutive] = useState<'yes' | 'no' | 'null'>(
    initAttributes?.is_executive || 'null'
  );
  const [isEmployee, setIsEmployee] = useState<'yes' | 'no' | 'null'>(
    initAttributes?.is_employee || 'null'
  );
  const [compensation, setCompensation] = useState<string>(
    initAttributes?.compensation ?? ''
  );

  useEffect(() => {
    setExtraFields({
      description1: title || null,
      position_attributes: {
        is_board: isBoard,
        is_executive: isExecutive,
        is_employee: isEmployee,
        compensation,
      },
    });
  }, [title, isBoard, isExecutive, isEmployee, compensation]);

  return (
    <>
      <TextInput placeholder='title' value={title} setValue={setTitle} />

      <RadioInput
        name='is_board'
        value={isBoard}
        options={['yes', 'no', 'null']}
        labels={['board', 'non-board', 'unknown']}
        setValue={setIsBoard}
      />

      <RadioInput
        name='is_executive'
        value={isExecutive}
        options={['yes', 'no', 'null']}
        labels={['executive', 'non-executive', 'unknown']}
        setValue={setIsExecutive}
      />

      <RadioInput
        name='is_employee'
        value={isEmployee}
        options={['yes', 'no', 'null']}
        labels={['employee', 'non-employee', 'unknown']}
        setValue={setIsEmployee}
      />

      <TextInput
        placeholder='compensation'
        value={compensation}
        setValue={setCompensation}
      />
    </>
  );
}
