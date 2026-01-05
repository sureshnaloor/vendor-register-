import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVendorCode(email: string, vendorCode: string, companyName: string) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Vendor Registration Successful - Your Vendor Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to Vendor Portal</h2>
          <p>Dear ${companyName},</p>
          <p>Your registration has been successfully processed.</p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Your Vendor Code is:</p>
            <h1 style="margin: 10px 0; color: #3b82f6; letter-spacing: 2px;">${vendorCode}</h1>
          </div>
          <p>Please keep this code safe. You will need it to login to the portal to update your information or upload additional documents.</p>
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
