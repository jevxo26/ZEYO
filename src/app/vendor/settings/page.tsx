'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Globe, Lock, ShieldCheck, Info } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { FormField } from '@/components/shared/FormField';
import { SettingsRow } from '@/components/shared/SettingsRow';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const navRoutes: Record<NavKey, string> = {
  dashboard: '/vendor/dashboard',
  bookings: '/vendor/bookings',
  wallet: '/vendor/wallet',
  profile: '/vendor/profile',
};


export default function VendorSettingsPage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('profile');
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="md:mx-auto md:max-w-sm md:px-6 md:py-4">
        <h1 className="px-4 py-2 text-lg font-semibold text-foreground md:px-0 md:text-xl">
          Settings
        </h1>

        <div className="px-4 md:px-0">
          <Card className="gap-3 px-4">
            <p className="text-sm font-semibold text-foreground">Profile Info</p>
            <FormField label="Name" defaultValue="Rahim Uddin" />
            <FormField label="Phone" defaultValue="+880 1712 345678" />
            <FormField label="Service Area" defaultValue="Gulshan, Dhaka" />
          </Card>
        </div>

        <div className="mt-3 px-4 md:px-0">
          <Card className="gap-0 py-0">
            <SettingsRow
              icon={<Bell className="h-4 w-4" />}
              label="Push Notifications"
              trailing={<Switch checked={pushEnabled} onChange={setPushEnabled} />}
            />
            <SettingsRow icon={<Globe className="h-4 w-4" />} label="Language" value="English" />
            <SettingsRow icon={<Lock className="h-4 w-4" />} label="Change Password" />
            <SettingsRow
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Verification Status"
              value="Verified"
            />
            <SettingsRow icon={<Info className="h-4 w-4" />} label="About" value="v1.0" />
          </Card>
        </div>

        <div className="px-4 py-4 md:px-0">
          <Button variant="destructive" className="w-full">
            Log Out
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}