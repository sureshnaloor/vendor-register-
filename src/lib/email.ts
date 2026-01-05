import nodemailer from 'nodemailer';

const config = {
  host: (process.env.EMAIL_HOST || '').trim(),
  port: parseInt(process.env.EMAIL_PORT || '465', 10),
  user: (process.env.EMAIL_USER || '').trim(),
  pass: (process.env.EMAIL_PASS || '').trim(),
  from: (process.env.EMAIL_FROM || '').trim(),
};

// Only log config check in development to avoid leaking info in production logs, 
// though we use masking for sensitive parts.
if (process.env.NODE_ENV !== 'production') {
  console.log('Email Client Initialized:', {
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    user: config.user ? `${config.user.substring(0, 3)}...` : 'MISSING',
  });
}

// Lazy initialize transporter to avoid failures during build if vars are missing
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!config.user || !config.pass || !config.host) {
    throw new Error(`Email credentials missing in environment variables. Check EMAIL_USER, EMAIL_PASS, and EMAIL_HOST in Vercel settings.`);
  }

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
}

export async function sendVendorCode(email: string, vendorCode: string, companyName: string) {
  try {
    const activeTransporter = getTransporter();
    const info = await activeTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Vendor Registration Successful - Your Vendor Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to Vendor Registration Portal of JAL</h2>
          <p>Dear ${companyName},</p>
          <p>Your registration has been successfully processed.</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Your Vendor Registration Code is:</p>
            <h1 style="margin: 10px 0; color: #3b82f6; letter-spacing: 2px;">${vendorCode}</h1>
          </div>
          <p>Please keep this code safe. You will need it to login to the portal to update your information or upload additional documents.
          Please note this is not the JAL's SAP Vendor code which will be mailed to you after successful pre-qualification subject to all criteria being met</p>
          <p>Best regards,<br>Procurement Team</p>
        </div>
      `,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
