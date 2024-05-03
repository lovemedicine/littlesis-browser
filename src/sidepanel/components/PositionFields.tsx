import { useState, useEffect } from 'preact/hooks';
import RadioInput from './RadioInput';
import TextInput from './TextInput';
import { parseNumberString } from '@src/util';

type Props = {
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function PositionFields({ setExtraFields }: Props) {
  const [isBoard, setIsBoard] = useState<'yes' | 'no' | 'null'>('null');
  const [isExecutive, setIsExecutive] = useState<'yes' | 'no' | 'null'>('null');
  const [isEmployee, setIsEmployee] = useState<'yes' | 'no' | 'null'>('null');
  const [compensation, setCompensation] = useState<string>('');

  useEffect(() => {
    setExtraFields({
      position_attributes: {
        is_board: isBoard,
        is_executive: isExecutive,
        is_employee: isEmployee,
        compensation: parseNumberString(compensation),
      },
    });

    return () => {
      setExtraFields({});
    };
  }, [isBoard, isExecutive, isEmployee, compensation]);

  return (
    <>
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
