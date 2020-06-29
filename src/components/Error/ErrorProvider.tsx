import React, {
  createContext, useCallback, useEffect, useState,
} from 'react';

function noop(): void { return undefined; }

interface ErrorContext {
  error?: string;
  resetError(): void;
  setError(error: string): void;
}

export const ErrorContext = createContext<ErrorContext>({
  resetError: noop,
  setError: noop,
});

let alertErrorCb: (err: string) => void = noop;

export const alertError = (err: string): void => alertErrorCb(err);

const ErrorProvider: React.FC = ({ children }) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const resetError = useCallback(() => setError(undefined), []);
  useEffect(() => {
    alertErrorCb = setError;
  }, []);

  return (
    <ErrorContext.Provider value={{ error, resetError, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
