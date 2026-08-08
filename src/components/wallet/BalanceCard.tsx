import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  balance: number;
  pendingText?: string;
  onWithdrawClick?: () => void;
}


export function BalanceCard({ balance, pendingText, onWithdrawClick }: BalanceCardProps) {
  return (
    <div className="mx-4 rounded-2xl bg-gray-900 p-5 text-white">
      <p className="text-xs text-gray-400">Available Balance</p>
      <p className="mt-1 text-3xl font-bold">{formatCurrency(balance)}</p>

      <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
        <ArrowUpRight className="h-3.5 w-3.5" />
        <span>Ready to withdraw</span>
        {pendingText && <span className="text-gray-500">· {pendingText}</span>}
      </div>

      <Button
        variant="secondary"
        className="mt-4 w-full"
        onClick={onWithdrawClick}
      >
        Request Withdrawal
      </Button>
    </div>
  );
}
