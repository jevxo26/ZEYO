const fs = require('fs');

const files = {
    'prisma/schema/location/zone.prisma': '  broadcastNotifications BroadcastNotification[] @relation("zoneBroadcasts")\n',
    'prisma/schema/customer/customer.prisma': '  notifications Notification[] @relation("customerNotifications")\n  inAppNotifications InAppNotification[] @relation("customerInAppNotifications")\n  notificationPreferences NotificationPreference? @relation("customerNotificationPreferences")\n  notificationHistory NotificationHistory[] @relation("customerNotificationHistory")\n  reminders Reminder[] @relation("customerReminders")\n  conversations Conversation[] @relation("customerConversations")\n  communicationLogs CommunicationLog[] @relation("customerCommunicationLogs")\n',
    'prisma/schema/booking/booking.prisma': '  notifications Notification[] @relation("bookingNotifications")\n  bookingNotifications BookingNotification[] @relation("bookingEventNotifications")\n  reminders Reminder[] @relation("bookingReminders")\n  conversations Conversation[] @relation("bookingConversations")\n',
    'prisma/schema/authentication/user.prisma': '  conversations Conversation[] @relation("adminConversations")\n',
    'prisma/schema/payment/payment.prisma': '  paymentNotifications PaymentNotification[] @relation("paymentNotifications")\n',
    'prisma/schema/vendor/vendorAssignment.prisma': '  assignmentNotifications AssignmentNotification[] @relation("assignmentNotifications")\n'
};

for (const [filePath, injection] of Object.entries(files)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the end of the FIRST model block (e.g. `model Zone { ... }`)
    // We can just find `\n}` at the end of the file if it's the only one, but to be safe:
    let lines = content.split('\n');
    let injectIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('}')) {
            injectIndex = i;
            break;
        }
    }
    
    if (injectIndex !== -1) {
        lines.splice(injectIndex, 0, injection);
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log('Injected relations in ' + filePath);
    } else {
        console.log('Model end not found in ' + filePath);
    }
}
