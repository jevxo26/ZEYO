'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { StatGroup } from '@/components/shared/StatCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { BookingRow, type Booking } from '@/components/shared/BookingRow';
import { Card } from '@/components/ui/card';

const recentBookings: Booking[] = [
  { id: '1', customerName: 'Farhan Islam', eventType: 'Wedding', date: '2024-05-19', amount: 65000, status: 'confirmed' },
  { id: '2', customerName: 'Nasima Begum', eventType: 'Birthday', date: '2024-05-13', amount: 35000, status: 'pending' },
  { id: '3', customerName: 'Kabir Hossain', eventType: 'Corporate', date: '2024-05-10', amount: 120000, status: 'completed' },
];

const navRoutes: Record<NavKey, string> = {
  dashboard: '/vendor/dashboard',
  bookings: '/vendor/bookings',
  wallet: '/vendor/wallet',
  profile: '/vendor/profile',
};

/**
 * Vendor Dashboard page.
 * Mobile e single column, md+ (tablet/desktop) e "Recent Bookings" ar
 * "This Week" pashapashi 2-column grid e boshe — chhoto screen e content
 * stack hoye jay, boro screen e space best-use hoy.
 */
export default function VendorDashboardPage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('dashboard');

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} unreadCount={1} />

      <div className="px-4 py-2 md:px-6">
        <p className="text-sm text-muted-foreground">Welcome Back,</p>
        <h1 className="text-lg font-semibold text-foreground md:text-xl">Rahim Ahmed</h1>
      </div>

      <div className="px-4 md:px-6">
        <StatGroup
          stats={[
            { label: 'Total Earnings', value: '৳345,000' },
            { label: 'This Month', value: '৳125,000' },
            { label: 'Completed', value: 47 },
          ]}
        />
      </div>

      <div className="mt-4 md:grid md:grid-cols-3 md:gap-6 md:px-6">
        <div className="md:col-span-2">
          <SectionHeader title="Recent Bookings" actionLabel="See All" />
          <Card className="mx-4 gap-0 py-0 md:mx-0">
            {recentBookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </Card>
        </div>

        <div className="mt-4 px-4 pb-4 md:mt-0 md:px-0 md:pb-0">
          <Card className="px-4">
            <p className="mb-2 text-sm font-semibold text-foreground">This Week</p>
            <div className="flex justify-between gap-2 text-center md:flex-col md:items-start md:gap-3 md:text-left">
              <div className="rounded-lg transition-colors md:w-full md:px-2 md:py-1.5 md:hover:bg-gray-50">
                <p className="text-base font-semibold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">New Leads</p>
              </div>
              <div className="rounded-lg transition-colors md:w-full md:px-2 md:py-1.5 md:hover:bg-gray-50">
                <p className="text-base font-semibold text-foreground">৳68,000</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <div className="rounded-lg transition-colors md:w-full md:px-2 md:py-1.5 md:hover:bg-gray-50">
                <p className="text-base font-semibold text-emerald-600">82%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}