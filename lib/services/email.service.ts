import { Resend } from 'resend';
import { env } from '@/lib/env';
import { kill } from 'process';

const resend = new Resend('kill');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface BookingConfirmationData {
  customerName: string;
  bookingNumber: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: string;
  specialRequests?: string;
}

interface BookingCancellationData {
  customerName: string;
  bookingNumber: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  cancellationDate: string;
}

interface CheckInWelcomeData {
  customerName: string;
  bookingNumber: string;
  roomName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  wifiPassword?: string;
}

/**
 * Send a generic email
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render booking confirmation email template
 */
export function renderBookingConfirmationEmail(
  data: BookingConfirmationData
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #14b8a6;
        }
        .header h1 {
          color: #14b8a6;
          margin: 0;
          font-size: 28px;
        }
        .content {
          margin-bottom: 30px;
        }
        .booking-details {
          background-color: #f0fdfa;
          border-left: 4px solid #14b8a6;
          padding: 20px;
          margin: 20px 0;
        }
        .booking-details h2 {
          color: #0d9488;
          margin-top: 0;
          font-size: 20px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #525252;
        }
        .detail-value {
          color: #171717;
        }
        .total-amount {
          background-color: #14b8a6;
          color: white;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          color: #737373;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Booking Confirmed</h1>
        </div>
        
        <div class="content">
          <p>Dear ${data.customerName},</p>
          <p>Thank you for choosing our hotel! We're delighted to confirm your reservation.</p>
          
          <div class="booking-details">
            <h2>Booking Details</h2>
            <div class="detail-row">
              <span class="detail-label">Booking Number:</span>
              <span class="detail-value">${data.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room:</span>
              <span class="detail-value">${data.roomName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in:</span>
              <span class="detail-value">${data.checkInDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out:</span>
              <span class="detail-value">${data.checkOutDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Guests:</span>
              <span class="detail-value">${data.numberOfGuests}</span>
            </div>
            ${
              data.specialRequests
                ? `
            <div class="detail-row">
              <span class="detail-label">Special Requests:</span>
              <span class="detail-value">${data.specialRequests}</span>
            </div>
            `
                : ''
            }
          </div>
          
          <div class="total-amount">
            Total Amount: ${data.totalAmount}
          </div>
          
          <p>We look forward to welcoming you! If you have any questions or need to make changes to your reservation, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Hotel Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Render booking cancellation email template
 */
export function renderBookingCancellationEmail(
  data: BookingCancellationData
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancellation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #ef4444;
        }
        .header h1 {
          color: #ef4444;
          margin: 0;
          font-size: 28px;
        }
        .content {
          margin-bottom: 30px;
        }
        .booking-details {
          background-color: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 20px;
          margin: 20px 0;
        }
        .booking-details h2 {
          color: #dc2626;
          margin-top: 0;
          font-size: 20px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #525252;
        }
        .detail-value {
          color: #171717;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          color: #737373;
          font-size: 14px;
        }
        .info-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancelled</h1>
        </div>
        
        <div class="content">
          <p>Dear ${data.customerName},</p>
          <p>This email confirms that your booking has been cancelled as requested.</p>
          
          <div class="booking-details">
            <h2>Cancelled Booking Details</h2>
            <div class="detail-row">
              <span class="detail-label">Booking Number:</span>
              <span class="detail-value">${data.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room:</span>
              <span class="detail-value">${data.roomName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in Date:</span>
              <span class="detail-value">${data.checkInDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out Date:</span>
              <span class="detail-value">${data.checkOutDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cancellation Date:</span>
              <span class="detail-value">${data.cancellationDate}</span>
            </div>
          </div>
          
          <div class="info-box">
            <p style="margin: 0;"><strong>Refund Information:</strong> If you made a payment, any applicable refund will be processed according to our cancellation policy. Please allow 5-10 business days for the refund to appear in your account.</p>
          </div>
          
          <p>We're sorry to see you cancel your reservation. We hope to have the opportunity to serve you in the future.</p>
          
          <p>If you have any questions about this cancellation or would like to make a new reservation, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Hotel Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Render check-in welcome email template
 */
export function renderCheckInWelcomeEmail(data: CheckInWelcomeData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Hotel</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #14b8a6;
        }
        .header h1 {
          color: #14b8a6;
          margin: 0;
          font-size: 28px;
        }
        .welcome-banner {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .welcome-banner h2 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          margin-bottom: 30px;
        }
        .room-details {
          background-color: #f0fdfa;
          border-left: 4px solid #14b8a6;
          padding: 20px;
          margin: 20px 0;
        }
        .room-details h3 {
          color: #0d9488;
          margin-top: 0;
          font-size: 18px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #525252;
        }
        .detail-value {
          color: #171717;
        }
        .amenities {
          background-color: #fafafa;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .amenities h3 {
          color: #0d9488;
          margin-top: 0;
        }
        .amenities ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .amenities li {
          padding: 5px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          color: #737373;
          font-size: 14px;
        }
        .wifi-box {
          background-color: #dbeafe;
          border: 2px solid #3b82f6;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          text-align: center;
        }
        .wifi-box strong {
          color: #1e40af;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏨 Welcome!</h1>
        </div>
        
        <div class="welcome-banner">
          <h2>Welcome to Our Hotel, ${data.customerName}!</h2>
          <p style="margin: 10px 0 0 0;">We're thrilled to have you as our guest</p>
        </div>
        
        <div class="content">
          <p>Your check-in has been completed successfully. We hope you have a wonderful stay with us!</p>
          
          <div class="room-details">
            <h3>Your Room Information</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Number:</span>
              <span class="detail-value">${data.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room:</span>
              <span class="detail-value">${data.roomName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room Number:</span>
              <span class="detail-value">${data.roomNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in Date:</span>
              <span class="detail-value">${data.checkInDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out Date:</span>
              <span class="detail-value">${data.checkOutDate}</span>
            </div>
          </div>
          
          ${
            data.wifiPassword
              ? `
          <div class="wifi-box">
            <p style="margin: 0 0 10px 0;">📶 <strong>WiFi Access</strong></p>
            <p style="margin: 0;">Network: Hotel Guest WiFi</p>
            <p style="margin: 5px 0 0 0;"><strong>Password: ${data.wifiPassword}</strong></p>
          </div>
          `
              : ''
          }
          
          <div class="amenities">
            <h3>Hotel Amenities & Services</h3>
            <ul>
              <li>🍳 Complimentary breakfast (7:00 AM - 10:00 AM)</li>
              <li>🏊 Swimming pool (6:00 AM - 10:00 PM)</li>
              <li>💪 Fitness center (24/7 access)</li>
              <li>🅿️ Free parking</li>
              <li>🧺 Laundry service available</li>
              <li>🍽️ Room service (24/7)</li>
            </ul>
          </div>
          
          <p><strong>Need Assistance?</strong><br>
          Our front desk is available 24/7 to help with any requests or questions. Simply dial "0" from your room phone or visit us at the lobby.</p>
          
          <p>We wish you a comfortable and memorable stay!</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Hotel Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  to: string,
  data: BookingConfirmationData
) {
  const html = renderBookingConfirmationEmail(data);
  return sendEmail({
    to,
    subject: `Booking Confirmation - ${data.bookingNumber}`,
    html,
  });
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellationEmail(
  to: string,
  data: BookingCancellationData
) {
  const html = renderBookingCancellationEmail(data);
  return sendEmail({
    to,
    subject: `Booking Cancellation - ${data.bookingNumber}`,
    html,
  });
}

/**
 * Send check-in welcome email
 */
export async function sendCheckInWelcomeEmail(
  to: string,
  data: CheckInWelcomeData
) {
  const html = renderCheckInWelcomeEmail(data);
  return sendEmail({
    to,
    subject: `Welcome to Our Hotel - ${data.bookingNumber}`,
    html,
  });
}
