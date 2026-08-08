'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Globe, Lock, ShieldCheck, Info, LogOut } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { FormField } from '@/components/shared/FormField';
import { SettingsRow } from '@/components/shared/SettingsRow';
import { Avatar } from '@/components/ui/avatar';
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

      <div className="md:px-6 md:py-4">
        <h1 className="px-4 py-2 text-lg font-semibold text-foreground md:px-0 md:text-2xl">
          Settings
        </h1>
        <p className="hidden px-0 text-sm text-muted-foreground md:block">
          Manage your profile, preferences and account security.
        </p>

        <div className="mt-4 space-y-3 px-4 md:grid md:grid-cols-5 md:gap-6 md:space-y-0 md:px-0">
          {/* Left column: Profile Info */}
          <div className="space-y-3 md:col-span-2">
            <Card className="items-center gap-3 px-4 text-center md:items-start md:text-left">
              <div className="flex w-full flex-col items-center gap-2 md:flex-row md:items-center">
                <Avatar name="Rahim Uddin" size="lg" />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-foreground">Rahim Uddin</p>
                  <p className="text-xs text-muted-foreground">Vendor Agent</p>
                </div>
              </div>

              <div className="w-full space-y-3 pt-2">
                <FormField label="Name" defaultValue="Rahim Uddin" />
                <FormField label="Phone" defaultValue="+880 1712 345678" />
                <FormField label="Service Area" defaultValue="Gulshan, Dhaka" />
                <Button className="w-full md:w-auto">Save Changes</Button>
              </div>
            </Card>
          </div>

          {/* Right column: Preferences + Account */}
          <div className="space-y-3 md:col-span-3">
            <Card className="gap-0 py-0">
              <p className="px-4 pt-4 pb-2 text-sm font-semibold text-foreground">Preferences</p>
              <SettingsRow
                icon={<Bell className="h-4 w-4" />}
                label=" Notifications"
                trailing={<Switch checked={pushEnabled} onChange={setPushEnabled} />}
              />
              <SettingsRow icon={<Globe className="h-4 w-4" />} label="Language" value="English" />
              <SettingsRow icon={<Lock className="h-4 w-4" />} label="Change Password" />
            </Card>

            <Card className="gap-0 py-0">
              <p className="px-4 pt-4 pb-2 text-sm font-semibold text-foreground">Account</p>
              <SettingsRow
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Verification Status"
                value="Verified"
              />
              <SettingsRow icon={<Info className="h-4 w-4" />} label="About" value="v1.0" />
            </Card>

            <Card className="gap-3 border-red-100 bg-red-50/40 px-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Log Out</p>
                <p className="text-xs text-muted-foreground">End your current session on this device.</p>
              </div>
              <Button variant="destructive" className="w-full md:w-auto">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}