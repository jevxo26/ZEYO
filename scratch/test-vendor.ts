import { VendorService } from '../server/services/vendor/vendorService';
import { VendorServiceService } from '../server/services/vendor/vendorServiceService';
import { VendorScheduleService } from '../server/services/vendor/vendorScheduleService';
import { VendorPortfolioService } from '../server/services/vendor/vendorPortfolioService';
import { VendorEmployeeService } from '../server/services/vendor/vendorEmployeeService';
import { VendorFinancialService } from '../server/services/vendor/vendorFinancialService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🚀 Starting Vendor Module Integration Tests...\n');

  let testVendorId: number;

  try {
    // 1. Create a Test Vendor
    console.log('1. Creating test vendor...');
    const vendor = await VendorService.createVendor({
      businessName: 'Apex Event Solutions',
      ownerName: 'Jon Doe',
      email: `jon.doe.${Date.now()}@example.com`,
      phone: '+8801700000000',
      businessType: 'company',
      tradeLicenseNumber: `TL-${Date.now()}`,
      description: 'Full-service event management and coordination agency.',
      profile: {
        about: 'Premium wedding planners since 2015.',
        establishedYear: 2015,
        experience: '8 Years',
        website: 'https://apexevents.example.com',
      },
      business: {
        tinNumber: 'TIN-123456789',
        binNumber: 'BIN-987654321',
        businessAddress: '123 Dhaka Ave, Gulshan, Dhaka',
      },
      owner: {
        nidNumber: 'NID-999999999',
        address: 'House 5, Road 2, Gulshan, Dhaka',
      },
      settings: {
        autoAcceptAssignment: true,
      },
    });

    if (!vendor) {
      throw new Error('Failed to create vendor');
    }
    testVendorId = vendor.id;
    console.log(`✅ Vendor created: ${vendor.businessName} (Code: ${vendor.vendorCode}, ID: ${vendor.id})`);

    // 2. Upload and Verify Documents
    console.log('\n2. Testing document upload and verification...');
    const doc = await VendorService.uploadDocument(testVendorId, {
      documentType: 'trade_license',
      documentName: 'Trade License 2026.pdf',
      documentUrl: '/uploads/docs/license.pdf',
    });
    console.log(`✅ Document uploaded (ID: ${doc.id}, Type: ${doc.documentType})`);

    const verifiedDoc = await VendorService.verifyDocument(doc.id, 1, 'approved');
    console.log(`✅ Document verification updated to: ${verifiedDoc.verificationStatus}`);

    // 3. Verify Vendor
    console.log('\n3. Testing general vendor verification...');
    const verifyLog = await VendorService.verifyVendor(testVendorId, 1, {
      verificationType: 'business',
      status: 'success',
      remarks: 'Trade license matches government records.',
    });
    console.log(`✅ Verification logged. Status: ${verifyLog.status}`);

    const refreshedVendor = await VendorService.getVendorById(testVendorId);
    console.log(`✅ Vendor status after verification: ${refreshedVendor?.status} (isVerified: ${refreshedVendor?.isVerified})`);

    // 4. Add Services & Service Zones
    console.log('\n4. Testing services registration...');
    const service = await VendorServiceService.addService(testVendorId, {
      serviceId: 101,
      serviceName: 'Photography',
    });
    console.log(`✅ Service registered: ${service.serviceName} (ID: ${service.id})`);

    const zone = await VendorServiceService.addServiceZone(service.id, {
      zoneId: 5,
    });
    console.log(`✅ Zone added: Zone ID ${zone.zoneId}`);

    // 5. Pricing Setup
    console.log('\n5. Testing service pricing configuration...');
    const pricing = await VendorServiceService.setPricing(service.id, {
      zoneId: 5,
      basePrice: 15000,
      minimumPrice: 12000,
      maximumPrice: 20000,
      priceType: 'daily',
    });
    console.log(`✅ Pricing configured. Base: ${pricing.basePrice} BDT (Type: ${pricing.priceType})`);

    // 6. Availability and Calendar
    console.log('\n6. Testing schedule and availability...');
    const avail = await VendorScheduleService.setAvailability(testVendorId, {
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // +10 days
      status: 'available',
      remarks: 'Available for winter bookings.',
    });
    console.log(`✅ General availability added from ${avail.availableFrom.toDateString()} to ${avail.availableTo.toDateString()}`);

    const block = await VendorScheduleService.addCalendarBlock(testVendorId, {
      bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
      availabilityStatus: 'busy',
      bookingId: 4004,
    });
    console.log(`✅ Calendar booking block registered for ${block.bookingDate.toDateString()} (Booking ID: ${block.bookingId})`);

    // 7. Portfolios & Galleries
    console.log('\n7. Testing portfolios and gallery assets...');
    const portfolio = await VendorPortfolioService.createPortfolio(testVendorId, {
      title: 'Grand Royal Wedding 2026',
      description: 'Stunning photography for a destination wedding at Coxs Bazar.',
    });
    console.log(`✅ Portfolio created: ${portfolio.title}`);

    const media = await VendorPortfolioService.addToGallery(testVendorId, {
      portfolioId: portfolio.id,
      imageUrl: 'https://images.example.com/dest-wedding.jpg',
      displayOrder: 1,
    });
    console.log(`✅ Gallery item added: ${media.imageUrl}`);

    // 8. Employees
    console.log('\n8. Testing vendor employee registration...');
    const emp = await VendorEmployeeService.addEmployee(testVendorId, {
      employeeName: 'Jane Smith',
      phone: '+8801800000000',
      designation: 'Photographer',
      joinedAt: new Date(),
    });
    console.log(`✅ Employee registered: ${emp.employeeName} (${emp.designation})`);

    // 9. Financial Ledger & Payout Workflow
    console.log('\n9. Testing financial and payout workflows...');
    const bank = await VendorFinancialService.addBankAccount(testVendorId, {
      bankName: 'City Bank',
      branchName: 'Gulshan',
      accountName: 'Apex Event Solutions',
      accountNumber: '11022033044',
      isDefault: true,
    });
    console.log(`✅ Bank account added: ${bank.bankName} (Acct: ${bank.accountNumber})`);

    // Credit booking payment to vendor wallet
    const transactionCredit = await VendorFinancialService.createTransaction(testVendorId, {
      bookingId: 4004,
      transactionType: 'credit',
      amount: 15000,
      reference: 'Booking 4004 payment credit',
    });
    console.log(`✅ Credit transaction created. New withdrawable wallet balance: ${transactionCredit.wallet.withdrawableAmount} BDT`);

    // Request payout
    const payoutReq = await VendorFinancialService.requestPayout(testVendorId, {
      requestedAmount: 10000,
      paymentMethod: 'bank_transfer',
    });
    console.log(`✅ Payout request submitted: ID ${payoutReq.id} for ${payoutReq.requestedAmount} BDT`);

    // Process/approve payout
    const processedPayout = await VendorFinancialService.processPayout(payoutReq.id, 1, 'approved');
    console.log(`✅ Payout request approved: Status is now ${processedPayout.payout.paymentStatus}. New withdrawable: ${processedPayout.wallet.withdrawableAmount} BDT, Pending: ${processedPayout.wallet.pendingAmount} BDT, Total balance: ${processedPayout.wallet.balance} BDT`);

    console.log('\n🌟 Integration tests completed successfully! No schema or relation violations detected.');

  } catch (error) {
    console.error('\n❌ Test execution failed with error:', error);
  } finally {
    // Cleanup test data to prevent database pollution
    console.log('\n🧹 Cleaning up test database records...');
    if (testVendorId!) {
      await prisma.vendor.delete({
        where: { id: testVendorId },
      });
      console.log('✅ Clean up completed successfully.');
    }
    await prisma.$disconnect();
  }
}

runTests();
