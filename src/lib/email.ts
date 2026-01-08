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
      subject: 'Vendor Registration Successful in JAL International- Your Vendor RegistrationCode',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to Vendor Registration Portal of JAL</h2>
          <p>Dear ${companyName},</p>
          <p>Your registration has been successfully initiated.</p>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Your 10-Digit Vendor Registration Code is:</p>
            <h1 style="margin: 10px 0; color: #3b82f6; letter-spacing: 2px;">${vendorCode}</h1>
          </div>

          <p>To complete your registration, please log in to our portal using the code above:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://vendor-register.vercel.app/login" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Vendor Portal</a>
          </div>

          <p>By logging in, you can complete all required fields and upload all necessary documents. 
          <strong>Please note that completing your profile and uploading all required documents is essential to make your company eligible for registration with JAL International.</strong></p>
          
          <p style="color: #64748b; font-size: 13px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Please note: This is a <strong>Registration Code</strong> for our portal and is not the final JAL SAP Vendor Code. 
            The SAP Vendor Code will be issued separately by Vendor Management, JAL International, after successful pre-qualification and subject to all criteria being met.
          </p>
          
          <p>Best regards,<br>Vendor Management,<br>JAL International.</p>
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

export async function sendAdminAlert(type: 'registration' | 'update', companyName: string, vendorCode: string) {
  try {
    const adminEmail = process.env.EMAIL_USER;
    if (!adminEmail) return false;

    const activeTransporter = getTransporter();
    const subject = type === 'registration'
      ? `Alert: New Vendor Registered - ${companyName}`
      : `Alert: Vendor Profile Updated - ${companyName}`;

    const info = await activeTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">${type === 'registration' ? 'New Vendor Registration' : 'Vendor Profile Update'}</h2>
          <p>The following vendor activity has occurred on the portal:</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Company Name:</strong> ${companyName}</li>
            <li><strong>Vendor Code:</strong> ${vendorCode}</li>
            <li><strong>Action:</strong> ${type === 'registration' ? 'New Registration' : 'Profile/Document Update'}</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>Please log in to the system for details.</p>
        </div>
      `,
    });
    console.log('Admin Alert Sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin alert:', error);
    return false;
  }
}

