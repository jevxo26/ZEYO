import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

dotenv.config();

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpService = process.env.SMTP_SERVICE || undefined;
const smtpAuthType = process.env.SMTP_AUTH_TYPE ? process.env.SMTP_AUTH_TYPE.toLowerCase() : undefined;

const auth: any = {};
if (smtpAuthType === 'oauth2') {
  auth.type = 'OAuth2';
  auth.user = smtpUser;
  auth.clientId = process.env.SMTP_OAUTH_CLIENT_ID;
  auth.clientSecret = process.env.SMTP_OAUTH_CLIENT_SECRET;
  auth.refreshToken = process.env.SMTP_OAUTH_REFRESH_TOKEN;
  if (process.env.SMTP_OAUTH_ACCESS_TOKEN) {
    auth.accessToken = process.env.SMTP_OAUTH_ACCESS_TOKEN;
  }
} else if (smtpUser && smtpPass) {
  auth.user = smtpUser;
  auth.pass = smtpPass;
}

const transporterOptions: any = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: Object.keys(auth).length ? auth : undefined,
};

if (smtpService) {
  transporterOptions.service = smtpService;
} else if (smtpHost.includes('gmail.com')) {
  transporterOptions.service = 'gmail';
}

const transporter = nodemailer.createTransport(transporterOptions);

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

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
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
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

export const sendTemplateEmail = async (to: string, subject: string, templateName: string, context: Record<string, any>) => {
  try {
    const templatePath = path.join(process.cwd(), 'server', 'templates', 'emails', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    const htmlContent = compiledTemplate(context);

    const textFallback = context.message || 'Please open this email in a client that supports HTML.';

    return await sendEmail(to, subject, textFallback, htmlContent);
  } catch (error) {
    console.error(`Error sending template email (${templateName}): `, error);
    throw error;
  }
};
