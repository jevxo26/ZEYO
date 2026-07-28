"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTemplateEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
dotenv_1.default.config();
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpService = process.env.SMTP_SERVICE || undefined;
const smtpAuthType = process.env.SMTP_AUTH_TYPE ? process.env.SMTP_AUTH_TYPE.toLowerCase() : undefined;
const auth = {};
if (smtpAuthType === 'oauth2') {
    auth.type = 'OAuth2';
    auth.user = smtpUser;
    auth.clientId = process.env.SMTP_OAUTH_CLIENT_ID;
    auth.clientSecret = process.env.SMTP_OAUTH_CLIENT_SECRET;
    auth.refreshToken = process.env.SMTP_OAUTH_REFRESH_TOKEN;
    if (process.env.SMTP_OAUTH_ACCESS_TOKEN) {
        auth.accessToken = process.env.SMTP_OAUTH_ACCESS_TOKEN;
    }
}
else if (smtpUser && smtpPass) {
    auth.user = smtpUser;
    auth.pass = smtpPass;
}
const transporterOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: Object.keys(auth).length ? auth : undefined,
};
if (smtpService) {
    transporterOptions.service = smtpService;
}
else if (smtpHost.includes('gmail.com')) {
    transporterOptions.service = 'gmail';
}
const transporter = nodemailer_1.default.createTransport(transporterOptions);
const logMissingConfig = () => {
    if (!smtpUser || !smtpPass) {
        console.warn('⚠️ SMTP_USER or SMTP_PASS is missing. Email delivery will fail unless OAuth2 is configured.');
    }
    if (smtpAuthType === 'oauth2' && (!process.env.SMTP_OAUTH_CLIENT_ID || !process.env.SMTP_OAUTH_CLIENT_SECRET || !process.env.SMTP_OAUTH_REFRESH_TOKEN)) {
        console.warn('⚠️ SMTP OAuth2 configuration is incomplete. Please set SMTP_OAUTH_CLIENT_ID, SMTP_OAUTH_CLIENT_SECRET, and SMTP_OAUTH_REFRESH_TOKEN.');
    }
};
logMissingConfig();
transporter.verify().then(() => {
    console.log('✅ SMTP transporter verified successfully');
}).catch((error) => {
    console.warn('⚠️ SMTP transporter verification failed. Check SMTP config if you expect email delivery.', error);
    if (smtpHost.includes('gmail.com')) {
        console.warn('Tip: Gmail usually requires an App Password when 2FA is enabled, or OAuth2 credentials. See https://support.google.com/mail/?p=BadCredentials');
    }
});
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME || 'My App'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
const sendTemplateEmail = async (to, subject, templateName, context) => {
    try {
        const templatePath = path_1.default.join(process.cwd(), 'server', 'templates', 'emails', `${templateName}.hbs`);
        const templateSource = fs_1.default.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars_1.default.compile(templateSource);
        const htmlContent = compiledTemplate(context);
        const textFallback = context.message || 'Please open this email in a client that supports HTML.';
        return await (0, exports.sendEmail)(to, subject, textFallback, htmlContent);
    }
    catch (error) {
        console.error(`Error sending template email (${templateName}): `, error);
        throw error;
    }
};
exports.sendTemplateEmail = sendTemplateEmail;
