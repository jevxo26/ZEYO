'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsIcon, HelpCircle, FileText } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatGroup } from '@/components/shared/StatCard';
import { SettingsRow } from '@/components/shared/SettingsRow';
import { Card } from '@/components/ui/card';

const navRoutes: Record<NavKey, string> = {
  dashboard: '/vendor/dashboard',
  bookings: '/vendor/bookings',
  wallet: '/vendor/wallet',
  profile: '/vendor/profile',
};

/**
 * Vendor Profile page — ProfileHeader (avatar+verified badge+contact),
 * StatGroup (bookings/earnings/rating), tarpor menu list (Settings,
 * Help & Support, Terms & Policies).
 */
export default function VendorProfilePage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('profile');

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="md:mx-auto md:max-w-sm md:px-6 md:py-4">
        <ProfileHeader
          name="Rahim Ahmed"
          phone="+880 1712-345678"
          area="Gulshan, Dhaka"
        />

        <div className="px-4 md:px-0">
          <StatGroup
            stats={[
              { label: 'Bookings', value: 47 },
              { label: 'Earnings', value: '৳345K' },
              { label: 'Rating', value: '4.9★' },
            ]}
          />
        </div>

        <div className="mt-4 px-4 md:px-0">
          <Card className="gap-0 py-0">
            <SettingsRow
              icon={<SettingsIcon className="h-4 w-4" />}
              label="Settings"
              onClick={() => router.push('/vendor/settings')}
            />
            <SettingsRow icon={<HelpCircle className="h-4 w-4" />} label="Help & Support" />
            <SettingsRow icon={<FileText className="h-4 w-4" />} label="Terms & Policies" />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}