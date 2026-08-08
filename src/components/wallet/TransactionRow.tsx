import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
}

interface TransactionRowProps {
  transaction: Transaction;
}


export function TransactionRow({ transaction }: TransactionRowProps) {
  const isCredit = transaction.type === 'credit';

  return (
    <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3 last:border-0 transition-colors hover:bg-gray-50/80">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          )}
        >
          {isCredit ? (
            <ArrowDownLeft className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
          <p className="text-xs text-gray-500">{transaction.date}</p>
        </div>
      </div>

      <span
        className={cn(
          'text-sm font-semibold',
          isCredit ? 'text-emerald-600' : 'text-red-500'
        )}
      >
        {isCredit ? '+' : '-'}
        {formatCurrency(Math.abs(transaction.amount))}
      </span>
    </div>
  );
}
