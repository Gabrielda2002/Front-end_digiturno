import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  footer?: ReactNode;
  noPadding?: boolean;
}

const Card: FC<CardProps> = ({
  children,
  title,
  className,
  footer,
  noPadding = false
}) => {
  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-soft overflow-hidden',
      className
    )}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={clsx(!noPadding && 'p-6')}>{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
