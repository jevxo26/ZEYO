'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  HelpCircle, 
  FileText, 
  LogOut,
  Calendar,
  DollarSign,
  Star,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
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


export default function VendorProfilePage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('profile');

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="space-y-4 px-4 py-4 md:px-6 md:py-6">
        {/* Profile Card with Soft Gradient */}
        <Card className="relative overflow-hidden border border-gray-100 bg-white px-4 pt-4 text-center shadow-sm md:px-6 md:pt-6">
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-amber-50/30 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-orange-50/30 blur-2xl" />
          
          <div className="relative">
            <ProfileHeader
              name="Rahim Ahmed"
              phone="+880 1712-345678"
              area="Gulshan, Dhaka"
            />
          </div>
        </Card>

        {/* Stats Cards with Icons - Soft Colors */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-1 flex justify-center">
              <div className="rounded-lg bg-blue-50/60 p-2">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">47</p>
            <p className="text-xs text-gray-500">Bookings</p>
          </div>
          
          <div className="rounded-xl bg-white p-4 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-1 flex justify-center">
              <div className="rounded-lg bg-emerald-50/60 p-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">৳345K</p>
            <p className="text-xs text-gray-500">Earnings</p>
          </div>
          
          <div className="rounded-xl bg-white p-4 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-1 flex justify-center">
              <div className="rounded-lg bg-amber-50/60 p-2">
                <Star className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">4.9★</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>

        {/* Quick Info - Subtle */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 p-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">rahim@email.com</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 p-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">+880 1712-345678</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 p-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Gulshan, Dhaka</span>
          </div>
        </div>

        {/* Settings Menu */}
        <Card className="gap-0 overflow-hidden border border-gray-100 bg-white py-0 shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-700">Account Settings</h3>
          </div>
          
          <SettingsRow
            icon={<SettingsIcon className="h-4 w-4" />}
            tone="blue"
            label="Settings"
            description="Notifications, language, password"
            onClick={() => router.push('/vendor/settings')}
          />
          <SettingsRow
            icon={<HelpCircle className="h-4 w-4" />}
            tone="purple"
            label="Help & Support"
            description="FAQs and contact support team"
          />
          <SettingsRow
            icon={<FileText className="h-4 w-4" />}
            tone="amber"
            label="Terms & Policies"
            description="Vendor agreement and guidelines"
          />
          <div className="border-t border-gray-100">
            <SettingsRow
              icon={<LogOut className="h-4 w-4" />}
              tone="red"
              label="Logout"
              description="Sign out from your account"
              onClick={handleLogout}
            />
          </div>
        </Card>

        {/* Version Info */}
        <p className="text-center text-xs text-gray-300">Version 2.0.0</p>
      </div>
    </PageContainer>
  );
}