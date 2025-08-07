import React from 'react';
import { Field } from 'formik';

interface AgreementCheckboxProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({ onChange, checked }) => {
  return (
    <div className="flex items-center space-x-3 my-4">
      <Field
        type="checkbox"
        id="agreement"
        name="agreement"
        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor="agreement" className="text-sm sm:text-base text-gray-700">
        {`Я согласен с `}
        <a href="#" className="text-blue-600 hover:underline">
          условиями договора
        </a>
      </label>
    </div>
  );
};

export default AgreementCheckbox;
