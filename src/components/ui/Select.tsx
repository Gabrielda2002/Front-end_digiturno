import { FC, SelectHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

const Select: FC<SelectProps> = ({
  label,
  options,
  error,
  className,
  fullWidth = true,
  id,
  children,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={clsx('mb-4', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500 bg-white',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-gray-300',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
