import { Phone, MapPin, BadgeCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  name: string;
  role?: string;
  phone: string;
  area: string;
  avatarSrc?: string;
}


export function ProfileHeader({ name, role = 'Vendor Agent', phone, area, avatarSrc }: ProfileHeaderProps) {
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="-mx-4 -mt-4 h-16 rounded-t-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

      {/* Avatar overlaps banner */}
      <div className="-mt-9 flex flex-col items-center">
        <div className="relative">
          <Avatar name={name} src={avatarSrc} size="lg" className="ring-4 ring-orange-400" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
            <BadgeCheck className="h-4 w-4 fill-emerald-500 text-white" />
          </span>
        </div>

        <h2 className="mt-2 text-base font-semibold text-gray-900">{name}</h2>
        <p className="text-xs text-gray-400">{role}</p>
      </div>

      {/* Contact info */}
      <div className="mt-4 w-full divide-y divide-gray-50 border-t border-gray-50 text-left">
        <div className="flex items-center gap-3 py-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500">
            <Phone className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] text-gray-400">Phone</p>
            <p className="text-sm text-gray-800">{phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] text-gray-400">Service Area</p>
            <p className="text-sm text-gray-800">{area}</p>
          </div>
        </div>
      </div>
    </div>
  );
}