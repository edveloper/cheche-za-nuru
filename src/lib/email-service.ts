import { google } from "googleapis";

const GOOGLE_SERVICE_ACCOUNT = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}"
);

const SEND_FROM_EMAIL = process.env.EMAIL_FROM || "noreply@chechezanurufoundation.org";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@chechezanurufoundation.org";

async function getGmailClient() {
  const auth = new google.auth.JWT({
    email: GOOGLE_SERVICE_ACCOUNT.client_email,
    key: GOOGLE_SERVICE_ACCOUNT.private_key,
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
    subject: SEND_FROM_EMAIL, // Impersonate the noreply email
  });

  return google.gmail({ version: "v1", auth });
}

function encodeMessage(to: string, subject: string, html: string, replyTo?: string): string {
  const mailHeaders = [
    `From: ${SEND_FROM_EMAIL}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=UTF-8`,
    `MIME-Version: 1.0`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
  ].join("\r\n");

  const mailBody = html;
  const message = `${mailHeaders}\r\n\r\n${mailBody}`;
  return Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const gmail = await getGmailClient();
    const encodedMessage = encodeMessage(
      payload.to,
      payload.subject,
      payload.html,
      payload.replyTo || ADMIN_EMAIL
    );

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("[Email Service] Email sent:", result.data.id);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);
    return false;
  }
}

export async function sendContactConfirmation(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "We received your message - Cheche Za Nuru",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f5c11a;">Thank you, ${name}!</h2>
        <p>We've received your message and will get back to you as soon as possible.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #f5c11a; margin: 20px 0;">
          <p><strong>Your message:</strong></p>
          <p>${message}</p>
        </div>
        <p>Best regards,<br><strong>Cheche Za Nuru Team</strong></p>
      </div>
    `,
    replyTo: email,
  });
}

export async function sendContactAdminNotification(
  name: string,
  email: string,
  phone: string | null,
  interest: string | null,
  message: string
): Promise<boolean> {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f5c11a;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Phone:</td>
            <td style="padding: 10px;">${phone}</td>
          </tr>` : ""}
          ${interest ? `<tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Interest:</td>
            <td style="padding: 10px;">${interest}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 10px;">${message}</td>
          </tr>
        </table>
      </div>
    `,
  });
}

export async function sendInvolvementConfirmation(
  name: string,
  email: string,
  interest: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "We got your interest - Cheche Za Nuru",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f5c11a;">Thank you for your interest, ${name}!</h2>
        <p>We're excited to see you're interested in getting involved with Cheche Za Nuru!</p>
        <p><strong>Area of Interest:</strong> ${interest}</p>
        <p>Our team will review your application and contact you soon with next steps.</p>
        <p>Best regards,<br><strong>Cheche Za Nuru Team</strong></p>
      </div>
    `,
    replyTo: email,
  });
}

export async function sendInvolvementAdminNotification(
  name: string,
  email: string,
  phone: string | null,
  interest: string,
  message: string | null
): Promise<boolean> {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Involvement Interest from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f5c11a;">New Involvement Interest</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Phone:</td>
            <td style="padding: 10px;">${phone}</td>
          </tr>` : ""}
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Interest:</td>
            <td style="padding: 10px;">${interest}</td>
          </tr>
          ${message ? `<tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 10px;">${message}</td>
          </tr>` : ""}
        </table>
      </div>
    `,
  });
}

export async function sendDonationConfirmation(
  donorName: string,
  email: string,
  amount: string,
  currency: string,
  fund: string | null
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "Thank you for your donation - Cheche Za Nuru",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f5c11a;">Thank you for your generosity, ${donorName}!</h2>
        <p>We've received your donation and are deeply grateful for your support.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #f5c11a; margin: 20px 0;">
          <p><strong>Donation Details:</strong></p>
          <p>Amount: ${currency} ${amount}</p>
          ${fund ? `<p>Fund: ${fund}</p>` : ""}
        </div>
        <p>Your contribution will make a real difference in our work. Thank you for believing in our mission!</p>
        <p>Best regards,<br><strong>Cheche Za Nuru Team</strong></p>
      </div>
    `,
    replyTo: email,
  });
}

export async function sendDonationAdminNotification(
  donorName: string,
  email: string,
  phone: string | null,
  amount: string,
  currency: string,
  fund: string | null
): Promise<boolean> {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Donation Received: ${currency} ${amount}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f5c11a;">New Donation Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; width: 120px;">Donor:</td>
            <td style="padding: 10px;">${donorName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Phone:</td>
            <td style="padding: 10px;">${phone}</td>
          </tr>` : ""}
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold;">Amount:</td>
            <td style="padding: 10px; font-size: 18px; color: #f5c11a;"><strong>${currency} ${amount}</strong></td>
          </tr>
          ${fund ? `<tr>
            <td style="padding: 10px; font-weight: bold;">Fund:</td>
            <td style="padding: 10px;">${fund}</td>
          </tr>` : ""}
        </table>
      </div>
    `,
  });
}
