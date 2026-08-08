'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Headphones
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

const faqs = [
  {
    id: 1,
    question: 'How do I manage my bookings?',
    answer: 'You can manage all your bookings from the Bookings section. Click on any booking to view details, update status, or cancel.',
    category: 'Bookings'
  },
  {
    id: 2,
    question: 'How do I withdraw my earnings?',
    answer: 'Go to the Wallet section and click on "Withdraw". You can transfer your earnings to your bank account or mobile wallet.',
    category: 'Payments'
  },
  {
    id: 3,
    question: 'How do I update my profile information?',
    answer: 'Navigate to Profile section and click on Edit Profile. You can update your name, phone number, address, and other details.',
    category: 'Profile'
  },
  {
    id: 4,
    question: 'What are the service fees?',
    answer: 'Service fees vary by service type. You can view the complete fee structure in your vendor agreement or contact support.',
    category: 'Payments'
  },
  {
    id: 5,
    question: 'How do I contact customer support?',
    answer: 'You can reach us via live chat, email (support@zeyo.com), or phone. Check the contact section below for details.',
    category: 'Support'
  },
];

export default function HelpSupportPage() {
  const router = useRouter();
  const [active, setActive] = useState<NavKey>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleNavigate = (key: NavKey) => {
    setActive(key);
    router.push(navRoutes[key]);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <PageContainer active={active} onNavigate={handleNavigate}>
      <TopBar balance={125000} />

      <div className="space-y-4 px-4 py-4 md:px-6 md:py-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-500">We're here to help you 24/7</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-blue-50 p-3">
              <MessageCircle className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Live Chat</span>
            <span className="text-xs text-gray-400">Chat with support</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-emerald-50 p-3">
              <Headphones className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Call Us</span>
            <span className="text-xs text-gray-400">+880 1234-567890</span>
          </button>
        </div>

        {/* Contact Options */}
        <Card className="overflow-hidden border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <Mail className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-xs text-gray-500">support@zeyo.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Phone className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-xs text-gray-500">+880 1234-567890</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Support Hours</p>
                <p className="text-xs text-gray-500">24/7 Available</p>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Frequently Asked Questions</h3>
            <span className="text-xs text-gray-400">{filteredFaqs.length} articles</span>
          </div>
          
          <Card className="overflow-hidden border border-gray-100 bg-white shadow-sm">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={faq.id}>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-500">{faq.category}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{faq.question}</p>
                    </div>
                    <ChevronRight 
                      className={cn(
                        'h-4 w-4 text-gray-400 transition-transform',
                        expandedFaq === faq.id && 'rotate-90'
                      )}
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                  {index < filteredFaqs.length - 1 && <div className="border-t border-gray-50" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No FAQs found</p>
                <p className="text-xs text-gray-400">Try adjusting your search</p>
              </div>
            )}
          </Card>
        </div>

        {/* Feedback */}
        <Card className="border border-gray-100 bg-amber-50/30 p-4 text-center shadow-sm">
          <p className="text-sm text-gray-700">Need more help?</p>
          <p className="text-xs text-gray-500">Our support team is always ready to assist you</p>
          <button className="mt-2 rounded-full bg-amber-500 px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600">
            Contact Support
          </button>
        </Card>
      </div>
    </PageContainer>
  );
}

// Add cn function if not imported
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}