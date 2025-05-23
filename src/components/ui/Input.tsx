import { FC, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  error,
  className,
  fullWidth = true,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={clsx('mb-4', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-gray-300',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
