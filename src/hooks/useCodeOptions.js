import { useState } from 'react';
import { DEFAULT_CODE_OPTIONS } from '../constants/config';

/**
 * Custom hook for managing code generation options
 * @returns {Object} Options state and handler
 */
export const useCodeOptions = () => {
  const [options, setOptions] = useState(DEFAULT_CODE_OPTIONS);

  const handleOptionChange = (key, value) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  return { options, setOptions, handleOptionChange };
};
