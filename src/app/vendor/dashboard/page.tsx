'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav, type NavKey } from '@/components/layout/BottomNav';
import { StatGroup } from '@/components/shared/StatCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { BookingRow, type Booking } from '@/components/shared/BookingRow';
import { Card } from '@/components/ui/card';

const recentBookings: Booking[] = [
  { id: '1', customerName: 'Farhan Islam', eventType: 'Wedding', date: '2024-05-19', amount: 65000, status: 'confirmed' },
  { id: '2', customerName: 'Nasima Begum', eventType: 'Birthday', date: '2024-05-13', amount: 35000, status: 'pending' },
  { id: '3', customerName: 'Kabir Hossain', eventType: 'Corporate', date: '2024-05-10', amount: 120000, status: 'completed' },
];

/**
 * Vendor Dashboard page - shudhu layout + shared component compose kora hoyeche.
 * Real data (Prisma/React Query theke) diye recentBookings ebong stats
 * replace kore nite hobe.
 */
export default function VendorDashboardPage() {
  const [active, setActive] = useState<NavKey>('dashboard');

  return (
    <PageContainer>
      <TopBar balance={125000} unreadCount={1} />

      <div className="px-4 py-2">
        <p className="text-sm text-muted-foreground">Welcome Back,</p>
        <h1 className="text-lg font-semibold text-foreground">Rahim Ahmed</h1>
      </div>

      <div className="px-4">
        <StatGroup
          stats={[
            { label: 'Total Earnings', value: '৳345,000' },
            { label: 'This Month', value: '৳125,000' },
            { label: 'Completed', value: 47 },
          ]}
        />
      </div>

      <div className="mt-4">
        <SectionHeader title="Recent Bookings" actionLabel="See All" />
        <Card className="mx-4 gap-0 py-0">
          {recentBookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </Card>
      </div>

      <div className="mt-4 px-4 pb-4">
        <Card className="px-4">
          <p className="mb-2 text-sm font-semibold text-foreground">This Week</p>
          <div className="flex justify-between text-center">
            <div>
              <p className="text-base font-semibold text-foreground">5</p>
              <p className="text-xs text-muted-foreground">New Leads</p>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">৳68,000</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <div>
              <p className="text-base font-semibold text-emerald-600">82%</p>
              <p className="text-xs text-muted-foreground">Conversion</p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav active={active} onNavigate={setActive} />
    </PageContainer>
  );
}