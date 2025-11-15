# Contact Form Email Setup Guide

Your contact form is now connected to Resend! Here's how to configure it:

## 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up/login
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy your API key (starts with `re_`)

## 2. Verify Your Domain (Important!)

For production use, you need to verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain registrar
5. Wait for verification (usually takes a few minutes)

**For Development/Testing:**

- Resend provides a test domain you can use immediately
- Emails will only be sent to your verified email address

## 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Resend API Key (get from resend.com/api-keys)
RESEND_API_KEY="re_your_actual_api_key_here"

# Sender email (must be from your verified domain)
EMAIL_FROM="noreply@yourdomain.com"

# Where contact form submissions should be sent
CONTACT_EMAIL="info@yourdomain.com"
```

**For Development:**

```bash
# Use your personal email for testing
RESEND_API_KEY="re_your_test_key"
EMAIL_FROM="onboarding@resend.dev"  # Resend's test domain
CONTACT_EMAIL="your-email@gmail.com"  # Your email to receive test submissions
```

## 4. Test the Contact Form

1. Restart your development server: `npm run dev`
2. Navigate to `/contact` on your site
3. Fill out and submit the contact form
4. Check your inbox (and spam folder) for the email

## What Was Created

### 1. Email Service (`lib/services/email.service.ts`)

- Handles sending emails via Resend
- Formats contact form data into a nice HTML email
- Includes error handling

### 2. Server Action (`actions/contact.actions.ts`)

- Validates form data using Zod
- Calls the email service
- Returns success/error responses

### 3. Updated Contact Page (`app/(public)/contact/page.tsx`)

- Now calls the server action on form submission
- Shows success/error toasts
- Clears form on successful submission

## Email Template Features

The contact form email includes:

- Professional HTML formatting
- All form fields (name, email, phone, subject, message)
- Reply-to set to the sender's email (you can reply directly)
- Clickable email and phone links
- Branded header with gradient

## Troubleshooting

### Emails not sending?

1. Check your API key is correct in `.env.local`
2. Verify your domain in Resend dashboard
3. Check the server console for error messages
4. Make sure you restarted the dev server after adding env variables

### Emails going to spam?

1. Verify your domain with proper DNS records
2. Add SPF and DKIM records (provided by Resend)
3. Use a professional sender email (not gmail/yahoo)

### Testing in development?

- Use `EMAIL_FROM="onboarding@resend.dev"` (Resend's test domain)
- Emails will only be sent to your verified email address
- Check Resend dashboard for email logs

## Production Checklist

Before going live:

- [ ] Verify your domain in Resend
- [ ] Add all DNS records (SPF, DKIM, DMARC)
- [ ] Use your domain email for `EMAIL_FROM`
- [ ] Set `CONTACT_EMAIL` to your business email
- [ ] Test the form thoroughly
- [ ] Check email deliverability

## Customization

### Change Email Template

Edit `lib/services/email.service.ts` to customize the HTML email template.

### Add Auto-Reply

You can add an auto-reply email to the customer by sending a second email in the `sendContactEmail` function.

### Add to Database

Consider saving contact form submissions to your database for backup:

```typescript
// In contact.actions.ts
await prisma.contactSubmission.create({
  data: validatedData,
});
```

## Support

- Resend Docs: https://resend.com/docs
- Resend Status: https://status.resend.com
- Email Logs: Check your Resend dashboard for delivery status
