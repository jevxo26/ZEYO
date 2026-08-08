import { Phone, MapPin } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface ProfileHeaderProps {
  name: string;
  phone: string;
  area: string;
  avatarSrc?: string;
}


export function ProfileHeader({ name, phone, area, avatarSrc }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
      <Avatar name={name} src={avatarSrc} size="lg" />
      <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
      <StatusBadge status="verified" />

      <div className="mt-2 w-full space-y-2 text-left">
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">{phone}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">{area}</span>
        </div>
      </div>
    </div>
  );
}
