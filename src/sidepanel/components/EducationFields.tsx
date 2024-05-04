import { useState, useEffect } from 'preact/hooks';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import { ExtraFieldsType } from './AddRelationshipForm';
import { parseNumberString } from '@src/util';

type Props = {
  initValues: ExtraFieldsType;
  setExtraFields: (values: { [key: string]: any }) => any;
};

export default function EducationFields({ initValues, setExtraFields }: Props) {
  const { description1: initType, education_attributes: initAttributes } =
    initValues;
  const [type, setType] = useState<string>(initType || '');
  const [field, setField] = useState<string>(initAttributes?.field || '');
  const [degreeId, setDegreeId] = useState<string>(
    initAttributes?.degree_id || ''
  );

  useEffect(() => {
    setExtraFields({
      description1: type || null,
      education_attributes: {
        field: field || null,
        degree_id: degreeId,
      },
    });
  }, [field]);

  return (
    <>
      <SelectInput
        placeholder='type'
        options={typeOptions}
        value={type}
        setValue={setType}
      />
      <SelectInput
        placeholder='degree'
        options={degreeOptions}
        value={degreeId}
        setValue={setDegreeId}
      />
      <TextInput placeholder='field' value={field} setValue={setField} />
    </>
  );
}

const typeOptions: [string, string][] = [
  ['null', 'type'],
  ['Undergraduate', 'Undergraduate'],
  ['Graduate', 'Graduate'],
  ['High School', 'High School'],
];

const degreeOptions: [string, string][] = [
  ['', 'degree'],
  ['22', 'Associate of Arts'],
  ['23', 'Associate of Science'],
  ['11', "Associate's Degree"],
  ['2', 'Bachelor of Arts'],
  ['37', 'Bachelor of Business Administration'],
  ['21', 'Bachelor of Engineering'],
  ['7', 'Bachelor of Laws'],
  ['4', 'Bachelor of Science'],
  ['16', 'Bachelor of Science in Business Administration'],
  ['33', 'Bachelor of Science in Economics'],
  ['20', 'Bachelor of Science in Engineering'],
  ['34', 'Bachelor of Science in Finance'],
  ['6', "Bachelor's Degree"],
  ['35', 'Certificate'],
  ['31', 'Doctor of Education'],
  ['17', 'Doctor of Medicine'],
  ['1', 'Doctor of Philosophy'],
  ['14', 'Doctor of Science'],
  ['10', 'Doctorate'],
  ['25', 'Drop Out'],
  ['30', 'High School Diploma'],
  ['13', 'Honorary Doctorate'],
  ['12', 'Honorus Degree'],
  ['5', 'Juris Doctor'],
  ['15', 'Master of Arts'],
  ['3', 'Master of Business Administration'],
  ['19', 'Master of Engineering'],
  ['38', 'Master of International Relations'],
  ['28', 'Master of Laws'],
  ['29', 'Master of Public Administration'],
  ['36', 'Master of Public Health'],
  ['32', 'Master of Public Policy'],
  ['9', 'Master of Science'],
  ['8', "Master's Degree"],
  ['26', 'Medical Doctor'],
  ['18', 'Post-Doctoral Training'],
  ['24', 'Postgraduate Diploma'],
  ['27', 'Registered Nurse'],
];
