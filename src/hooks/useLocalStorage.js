import { useEffect, useState } from 'react';
import { readStoredValue } from '../utils/storage';

export default function useLocalStorage(key, initialValue, validate) {
  const [value, setValue] = useState(() =>
    readStoredValue(key, initialValue, validate)
  );

  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError('');
    } catch {
      setStorageError(
        'ბრაუზერში შენახვა მიუწვდომელია. მონაცემები იმუშავებს გვერდის განახლებამდე.'
      );
    }
  }, [key, value]);

  return [value, setValue, storageError];
}