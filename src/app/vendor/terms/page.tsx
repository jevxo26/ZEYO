'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  DollarSign,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TopBar } from '@/components/layout/TopBar';
import type { NavKey } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';

const navRoutes: Record<NavKey, string> = {
  dashboard: '/vendor/dashboard',
  bookings: '/vendor/bookings',
  wallet: '/vendor/wallet',
  profile: '/vendor/profile',
};

interface PolicySection {
  id: string;
  title: string;
  icon: any;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: FileText,
    content: [
      'Welcome to ZEYO Vendor Agreement. By using our platform, you agree to comply with and be bound by the following terms and conditions.',
      'This agreement governs your relationship with ZEYO as a service provider and outlines your rights and responsibilities.',
      'Please read these terms carefully before using our platform.'
    ]
  },
  {
    id: 'vendor-obligations',
    title: 'Vendor Obligations',
    icon: Users,
    content: [
      'Provide accurate and complete information about your services.',
      'Maintain professional standards and quality of service.',
      'Respond to customer inquiries and booking requests promptly.',
      'Honor all confirmed bookings and appointments.',
      'Keep your profile information up to date.',
      'Comply with all applicable laws and regulations.'
    ]
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    icon: DollarSign,
    content: [
      'Commission fees: 15% on all completed bookings.',
      'Payment processing: 3-5 business days for settlement.',
      'Minimum payout threshold: ৳1,000',
      'Payout methods: Bank transfer, Mobile wallet (bKash, Nagad)',
      'Payment cycle: Weekly settlements (every Monday).',
      'Tax compliance: 5% VAT applicable on service fees.'
    ]
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    icon: AlertCircle,
    content: [
      'Free cancellation within 24 hours of booking.',
      'Cancellation between 24-48 hours: 50% service fee.',
      'Cancellation less than 24 hours: 100% service fee.',
      'No-show policy: Full service fee will be charged.',
      'Emergency cancellations: Contact support for exceptions.'
    ]
  },
  {
    id: 'privacy-data',
    title: 'Privacy & Data Protection',
    icon: Shield,
    content: [
      'We collect and process your personal data in accordance with our Privacy Policy.',
      'Your data is used for: Service delivery, Communication, Analytics, Compliance.',
      'We never share your sensitive personal information with third parties without your consent.',
      'You have the right to access, modify, or delete your personal data.',
      'Data retention period: 5 years after account closure.'
    ]
  },
  {
    id: 'service-standards',
    title: 'Service Standards',
    icon: CheckCircle,
    content: [
      'Deliver high-quality services consistently.',
      'Maintain a 95%+ customer satisfaction rating.',
      'Respond to customer messages within 2 hours.',
      'Arrive on time for all appointments.',
      'Maintain hygiene and safety standards.',
      'Follow all safety protocols and guidelines.'
    ]
  }
];

export default function TermsPoliciesPage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('profile');
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? '' : id);
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="space-y-4 px-4 py-4 md:px-6 md:py-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Terms & Policies</h1>
          <p className="text-sm text-gray-500">Vendor agreement and guidelines</p>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">Last Updated: January 15, 2024</span>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border border-gray-100 bg-white p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-amber-500">15%</p>
            <p className="text-xs text-gray-500">Commission Fee</p>
          </Card>
          <Card className="border border-gray-100 bg-white p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-emerald-500">5</p>
            <p className="text-xs text-gray-500">Days Settlement</p>
          </Card>
        </div>

        {/* Policy Sections */}
        <div className="space-y-3">
          {policySections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <Card key={section.id} className="overflow-hidden border border-gray-100 bg-white shadow-sm">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2">
                      <Icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <ul className="space-y-2">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact Card */}
        <Card className="border border-gray-100 bg-amber-50/30 p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Have Questions?</h3>
          <p className="text-sm text-gray-600">
            If you have any questions about our terms and policies, please contact our support team.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-600">legal@zeyo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-600">+880 1234-567890</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-600">Gulshan, Dhaka, Bangladesh</span>
            </div>
          </div>
        </Card>

        {/* Acceptance */}
        <Card className="border border-green-100 bg-green-50/30 p-4 text-center shadow-sm">
          <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
          <p className="mt-2 text-sm font-medium text-gray-700">By using our platform, you accept these terms</p>
          <p className="text-xs text-gray-500">Last reviewed: January 15, 2024</p>
        </Card>
      </div>
    </PageContainer>
  );
}