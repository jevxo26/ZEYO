"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const communicationController_1 = require("../../controllers/notification/communicationController");
const router = (0, express_1.Router)();
// Customer facing chat/communication routes
router.use(authMiddleware_1.verifyToken);
router.get('/conversations', communicationController_1.CommunicationController.getMyConversations);
router.post('/conversations', communicationController_1.CommunicationController.startConversation);
router.get('/conversations/:id', communicationController_1.CommunicationController.getConversationThread);
router.post('/messages', communicationController_1.CommunicationController.sendMessage);
exports.default = router;
