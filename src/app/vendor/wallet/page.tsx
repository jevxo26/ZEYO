'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, Smartphone } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { WithdrawMethodRow } from '@/components/wallet/WithdrawMethodRow';
import { TransactionRow, type Transaction } from '@/components/wallet/TransactionRow';
import { Card } from '@/components/ui/card';

const transactions: Transaction[] = [
  { id: '1', title: 'Commission Released', date: '2024-05-19', amount: 18000, type: 'credit' },
  { id: '2', title: 'Withdrawal to bKash', date: '2024-05-15', amount: 30000, type: 'debit' },
  { id: '3', title: 'Commission Released', date: '2024-05-10', amount: 14300, type: 'credit' },
];

const navRoutes: Record<NavKey, string> = {
  dashboard: '/vendor/dashboard',
  bookings: '/vendor/bookings',
  wallet: '/vendor/wallet',
  profile: '/vendor/profile',
};


export default function VendorWalletPage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('wallet');
  const [method, setMethod] = useState<'bank' | 'mobile'>('mobile');

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="px-4 py-2 md:px-6">
        <h1 className="text-lg font-semibold text-foreground md:text-xl">Wallet</h1>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-6 md:px-6">
        {/* Left column: balance + withdraw method */}
        <div>
          <div className="md:px-0">
            <BalanceCard balance={125000} pendingText="Pending ৳15,000" />
          </div>

          <div className="mt-4 space-y-2 px-4 md:px-0">
            <p className="px-0.5 text-sm font-semibold text-foreground">Withdraw Method</p>
            <WithdrawMethodRow
              icon={<Landmark className="h-4 w-4" />}
              label="Bank Transfer"
              description="Send to your bank account"
              selected={method === 'bank'}
              onClick={() => setMethod('bank')}
            />
            <WithdrawMethodRow
              icon={<Smartphone className="h-4 w-4" />}
              label="Mobile Banking"
              description="bKash, Nagad, Rocket"
              selected={method === 'mobile'}
              onClick={() => setMethod('mobile')}
            />
          </div>
        </div>

        {/* Right column: recent transactions */}
        <div className="mt-4 md:mt-0">
          <SectionHeader title="Recent Transactions" />
          <Card className="mx-4 gap-0 py-0 md:mx-0">
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}