'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { FilterTabs } from '@/components/shared/FilterTabs';
import { BookingRow, type Booking } from '@/components/shared/BookingRow';
import { Card } from '@/components/ui/card';

const allBookings: Booking[] = [
  { id: '1', customerName: 'Farhan Islam', eventType: 'Wedding', location: 'Bashundhara, Dhaka', date: '2024-05-19', time: '10:00 AM', amount: 65000, status: 'confirmed' },
  { id: '2', customerName: 'Nasima Begum', eventType: 'Birthday', location: 'Dhanmondi, Dhaka', date: '2024-05-13', time: '4:00 PM', amount: 35000, status: 'pending' },
  { id: '3', customerName: 'Kabir Hossain', eventType: 'Corporate', location: 'Uttara, Dhaka', date: '2024-05-10', time: '9:00 AM', amount: 120000, status: 'completed' },
  { id: '4', customerName: 'Tasnim Rahman', eventType: 'Wedding', location: 'Mirpur, Dhaka', date: '2024-05-05', time: '6:00 PM', amount: 95000, status: 'pending' },
  { id: '5', customerName: 'Jamil Khan', eventType: 'Corporate', location: 'Gulshan, Dhaka', date: '2024-04-28', time: '11:00 AM', amount: 65000, status: 'cancelled' },
];

type FilterKey = 'all' | 'confirmed' | 'pending' | 'completed';

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Complete' },
];

const navRoutes: Record<NavKey, string> = {
  dashboard: '/vendor/dashboard',
  bookings: '/vendor/bookings',
  wallet: '/vendor/wallet',
  profile: '/vendor/profile',
};

/**
 * Vendor Bookings page — FilterTabs + BookingRow shared component diye
 * compose kora. Real app e "allBookings" React Query theke ashbe.
 */
export default function VendorBookingsPage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('bookings');
  const [filter, setFilter] = useState<FilterKey>('all');

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  const filteredBookings = useMemo(
    () => (filter === 'all' ? allBookings : allBookings.filter((b) => b.status === filter)),
    [filter]
  );

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="px-4 py-2 md:px-6">
        <h1 className="text-lg font-semibold text-foreground md:text-xl">My Bookings</h1>
      </div>

      <FilterTabs tabs={filterTabs} active={filter} onChange={setFilter} />

      <p className="px-4 pb-2 text-xs text-muted-foreground md:px-6">
        {filteredBookings.length} bookings found
      </p>

      <div className="md:px-6">
        <Card className="mx-4 gap-0 py-0 md:mx-0">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => <BookingRow key={booking.id} booking={booking} />)
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No bookings found for this filter.
            </p>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}