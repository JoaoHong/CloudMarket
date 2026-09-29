import type { Installments } from '../types';
import { formatBRL } from '../utils/format';

interface Props {
  price: number;
  originalPrice?: number | null;
  discountPercent?: number;
  installments?: Installments;
  size?: 'md' | 'lg';
}

export default function Price({ price, originalPrice, discountPercent = 0, installments, size = 'md' }: Props) {
  return (
    <div>
      {originalPrice && discountPercent > 0 && (
        <p className="text-xs text-gray-400 line-through">{formatBRL(originalPrice)}</p>
      )}
      <p className={size === 'lg' ? 'text-3xl font-light' : 'text-xl font-normal'}>
        {formatBRL(price)}
        {discountPercent > 0 && (
          <span className="ml-2 align-middle text-sm font-medium text-success">{discountPercent}% OFF</span>
        )}
      </p>
      {installments && (
        <p className="text-sm text-success">
          em {installments.count}x {formatBRL(installments.amount)}
          {installments.interestFree && ' sem juros'}
        </p>
      )}
    </div>
  );
}
