"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../config/prisma");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const DEFAULT_VENDORS = [
    {
        id: "V-4029",
        name: "Dhaka Royal Photography Studio",
        category: "Photography",
        zone: "Dhaka Zone",
        rating: "4.9",
        jobs: 3,
        verified: true,
        payoutRate: "৳32,000 / Event",
    },
    {
        id: "V-1102",
        name: "Cinematic Beats Videography",
        category: "Videography",
        zone: "Dhaka Zone",
        rating: "4.8",
        jobs: 2,
        verified: true,
        payoutRate: "৳36,000 / Event",
    },
    {
        id: "V-8831",
        name: "Grand Kacchi Caterers Bangladesh",
        category: "Catering",
        zone: "Dhaka Zone",
        rating: "4.9",
        jobs: 4,
        verified: true,
        payoutRate: "৳650 / Plate",
    },
    {
        id: "V-3344",
        name: "Sylhet Garden Floral & Decor",
        category: "Decoration",
        zone: "Sylhet Zone",
        rating: "4.7",
        jobs: 1,
        verified: true,
        payoutRate: "৳42,000 / Event",
    },
    {
        id: "V-5510",
        name: "Chattogram Stage & Sound Systems",
        category: "Stage & Lighting",
        zone: "Chattogram Zone",
        rating: "4.6",
        jobs: 2,
        verified: true,
        payoutRate: "৳38,000 / Event",
    },
    {
        id: "V-7712",
        name: "Rajshahi Imperial Sound & DJ",
        category: "Sound System",
        zone: "Rajshahi Zone",
        rating: "4.8",
        jobs: 1,
        verified: true,
        payoutRate: "৳28,000 / Event",
    },
];
const DEFAULT_VENDOR_TASKS = [
    {
        id: "TASK-101",
        bookingNumber: "#BKG-2026-001",
        title: "Royal Wedding Ceremony Coverage",
        eventType: "Wedding",
        eventDate: "2026-11-15",
        venueAddress: "Gulshan Club, Dhaka Zone",
        status: "in_progress",
        payoutBDT: 35000,
        instructions: "Ensure 2 Senior Photographers arrive by 4:00 PM for equipment check and stage setup.",
        deliverables: ["raw_footage_zip", "teaser_clip_4k"],
    },
    {
        id: "TASK-102",
        bookingNumber: "#BKG-2026-002",
        title: "Gaye Holud Stage & Floral Decor",
        eventType: "Gaye Holud",
        eventDate: "2026-11-13",
        venueAddress: "Banani Convention Hall, Dhaka Zone",
        status: "completed",
        payoutBDT: 65000,
        instructions: "Fresh floral backdrop with yellow marigold theme.",
        deliverables: ["decor_approval_sheet"],
    },
];
const DEFAULT_VENDOR_PAYOUTS = [
    {
        id: "PAY-2026-101",
        bookingNumber: "#BKG-2026-001",
        eventName: "Royal Wedding Ceremony (Photography Coverage)",
        serviceCategory: "Photography",
        eventDate: "2026-11-15",
        payoutAmount: 35000,
        status: "paid_out",
        clearedAt: "2026-11-16",
    },
    {
        id: "PAY-2026-102",
        bookingNumber: "#BKG-2026-002",
        eventName: "Gaye Holud Night (Stage & Decor)",
        serviceCategory: "Decoration",
        eventDate: "2026-11-13",
        payoutAmount: 65000,
        status: "escrow_pending",
        clearedAt: "2026-11-14",
    },
];
// GET /api/vendors
router.get('/', async (req, res) => {
    try {
        const dbVendors = await prisma_1.prisma.user.findMany({
            where: { role: 'vendor' },
            take: 20,
        }).catch(() => []);
        if (dbVendors && dbVendors.length > 0) {
            const mapped = dbVendors.map((u, i) => ({
                id: `V-${1000 + i}`,
                name: u.name || 'Vendor Partner',
                category: 'Event Fulfillment',
                zone: 'Dhaka Zone',
                rating: '4.9',
                jobs: 1,
                verified: true,
                payoutRate: '৳35,000 / Event',
            }));
            return res.json({ success: true, data: mapped });
        }
        return res.json({ success: true, data: DEFAULT_VENDORS });
    }
    catch (err) {
        return res.json({ success: true, data: DEFAULT_VENDORS });
    }
});
// POST /api/vendors
router.post('/', async (req, res) => {
    const body = req.body;
    const newVendor = {
        id: body.id || `V-${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name || 'New Vendor Partner',
        category: body.category || 'Event Service',
        zone: body.zone || 'Dhaka Zone',
        rating: '4.9',
        jobs: 0,
        verified: true,
        payoutRate: body.payoutRate || '৳35,000 / Event',
    };
    DEFAULT_VENDORS.unshift(newVendor);
    return res.json({ success: true, message: 'Vendor created successfully', data: newVendor });
});
// GET /api/vendors/tasks
router.get('/tasks', (req, res) => {
    return res.json({ success: true, data: DEFAULT_VENDOR_TASKS });
});
// GET /api/vendors/earnings
router.get('/earnings', (req, res) => {
    return res.json({ success: true, data: DEFAULT_VENDOR_PAYOUTS });
});
let mockVendorProfile = {
    businessName: 'My Vendor Business',
    contactName: 'John Doe',
    email: 'vendor@evento.com',
    phone: '+8801700000000',
    address: '123 Vendor Street, Dhaka',
    serviceZones: ['Dhaka Metro (Core Zone)'],
    notifications: {
        email: true,
        sms: false,
        push: true
    }
};
// GET /api/vendors/me
router.get('/me', authMiddleware_1.verifyToken, (req, res) => {
    return res.json({ success: true, data: mockVendorProfile });
});
// PUT /api/vendors/me
router.put('/me', authMiddleware_1.verifyToken, (req, res) => {
    mockVendorProfile = Object.assign(Object.assign({}, mockVendorProfile), req.body);
    return res.json({ success: true, message: 'Vendor settings updated successfully', data: mockVendorProfile });
});
let mockDispatchNotes = {};
// GET /api/vendors/dispatch/:taskId
router.get('/dispatch/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const notes = mockDispatchNotes[taskId] || [
        {
            id: 1,
            author: "EVENTO Coordinator (Arif)",
            initials: "EA",
            time: "2 hours ago",
            text: "Please ensure the team coordinates with venue security for equipment clearance upon arrival.",
        }
    ];
    return res.json({ success: true, data: notes });
});
// POST /api/vendors/dispatch/:taskId
router.post('/dispatch/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const { text } = req.body;
    if (!mockDispatchNotes[taskId]) {
        mockDispatchNotes[taskId] = [
            {
                id: 1,
                author: "EVENTO Coordinator (Arif)",
                initials: "EA",
                time: "2 hours ago",
                text: "Please ensure the team coordinates with venue security for equipment clearance upon arrival.",
            }
        ];
    }
    const newNote = {
        id: Date.now(),
        author: "You (Vendor Partner)",
        initials: "VP",
        time: "Just now",
        text,
    };
    mockDispatchNotes[taskId].push(newNote);
    return res.json({ success: true, data: newNote });
});
exports.default = router;
