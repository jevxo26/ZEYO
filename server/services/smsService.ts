import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client: ReturnType<typeof twilio> | null = null;

const getTwilioClient = () => {
  if (client) {
    return client;
  }

  if (!accountSid || !authToken || !twilioPhoneNumber || !accountSid.startsWith('AC')) {
    return null;
  }

  client = twilio(accountSid, authToken);
  return client;
};

export const sendSMS = async (to: string, body: string) => {
  try {
    const twilioClient = getTwilioClient();

    if (!twilioClient) {
      throw new Error('Twilio SMS is not configured');
    }

    const message = await twilioClient.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
    console.log('SMS sent: %s', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending SMS: ', error);
    throw error;
  }
};
