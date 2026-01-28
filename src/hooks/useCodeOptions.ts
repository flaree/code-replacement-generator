import { useState } from 'react';
import { DEFAULT_CODE_OPTIONS, CodeOptions } from '../constants/config';

interface UseCodeOptionsReturn {
  options: CodeOptions;
  setOptions: React.Dispatch<React.SetStateAction<CodeOptions>>;
  handleOptionChange: <K extends keyof CodeOptions>(key: K, value: CodeOptions[K]) => void;
}

export const useCodeOptions = (): UseCodeOptionsReturn => {
  const [options, setOptions] = useState<CodeOptions>(DEFAULT_CODE_OPTIONS);

  const handleOptionChange = <K extends keyof CodeOptions>(key: K, value: CodeOptions[K]): void => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: value,
    }));
  };

  return { options, setOptions, handleOptionChange };
};
