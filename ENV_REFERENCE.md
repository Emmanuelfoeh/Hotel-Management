# Environment Variables Quick Reference

This document provides a quick reference for all environment variables used in the Hotel Management System.

## Required Variables

### Database

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"
```

**Purpose:** PostgreSQL database connection string  
**Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`  
**Where to get:** Your PostgreSQL installation or cloud provider  
**Example providers:** Vercel Postgres, Supabase, Railway, local PostgreSQL

---

### Authentication (NextAuth.js)

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**NEXTAUTH_URL:**

- **Purpose:** Base URL for authentication callbacks
- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`

**NEXTAUTH_SECRET:**

- **Purpose:** Secret key for encrypting tokens and sessions
- **Generate:** `openssl rand -base64 32`
- **Requirements:** Minimum 32 characters, unique per environment
- **Security:** Never reuse across environments, rotate regularly

---

### Payment Gateway (Paystack)

```env
PAYSTACK_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxx"
```

**Where to get:** [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developers)

**Test Mode (Development):**

- Use keys starting with `sk_test_` and `pk_test_`
- Test cards: https://paystack.com/docs/payments/test-payments
- Success card: 4084084084084081
- Decline card: 4084080000000408

**Live Mode (Production):**

- Use keys starting with `sk_live_` and `pk_live_`
- Requires verified Paystack account
- Configure webhook URL in dashboard

**Security Note:** `PAYSTACK_SECRET_KEY` is server-side only, never expose to client

---

### Email Service (Resend)

```env
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"
```

**Where to get:** [Resend API Keys](https://resend.com/api-keys)

**EMAIL_FROM:**

- Must be a verified email address or domain
- Development: Can use `onboarding@resend.dev`
- Production: Verify your domain in Resend dashboard
- Format: `name@domain.com` or `"Name" <name@domain.com>`

**Email types sent:**

- Booking confirmations
- Booking cancellations
- Check-in welcome messages
- Payment receipts

---

### File Upload (Uploadthing)

```env
UPLOADTHING_SECRET="sk_xxx"
UPLOADTHING_APP_ID="xxx"
```

**Where to get:** [Uploadthing Dashboard](https://uploadthing.com/dashboard)

**Setup:**

1. Create account at uploadthing.com
2. Create new app
3. Copy App ID and Secret from dashboard

**Used for:**

- Room images (max 4MB, up to 10 images)
- Gallery photos (max 8MB, up to 20 images)
- Future: Customer profile pictures

---

### Application Settings

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Hotel Management System"
```

**NEXT_PUBLIC_APP_URL:**

- **Purpose:** Base URL for generating absolute URLs
- **Used for:** Email links, payment callbacks, API URLs
- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`
- **Important:** Must match your actual domain

**NEXT_PUBLIC_APP_NAME:**

- **Purpose:** Application name displayed in UI and emails
- **Default:** "Hotel Management System"
- **Optional:** Can be customized to your hotel name

---

## Optional Variables

### Error Tracking (Sentry)

```env
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_AUTH_TOKEN="xxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
```

**Where to get:** [Sentry Dashboard](https://sentry.io/settings/projects/)

**Purpose:** Error tracking and monitoring in production  
**Recommended:** Yes for production environments  
**Setup:** Create project in Sentry, copy DSN and auth token

---

### Analytics (Google Analytics)

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Where to get:** [Google Analytics](https://analytics.google.com/)

**Purpose:** Track user behavior and site analytics  
**Format:** Starts with `G-`  
**Optional:** Only if you want analytics tracking

---

### Development Settings

```env
DEBUG="false"
NODE_ENV="development"
```

**DEBUG:**

- Enable verbose logging
- Values: `"true"` or `"false"`
- Default: `"false"`

**NODE_ENV:**

- Automatically set by Next.js
- Values: `"development"`, `"production"`, `"test"`
- Don't manually set unless needed

---

## Environment-Specific Configurations

### Development (.env.local)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hotel_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-min-32-chars-long-xxxxx"
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxx"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="onboarding@resend.dev"
UPLOADTHING_SECRET="sk_xxxxxxxxxxxxx"
UPLOADTHING_APP_ID="xxxxxxxxxxxxx"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Hotel Management System"
```

### Production (Hosting Platform)

```env
DATABASE_URL="postgresql://user:pass@prod-host:5432/hotel_db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="prod-secret-strong-unique-min-32-chars"
PAYSTACK_SECRET_KEY="sk_live_xxxxxxxxxxxxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_xxxxxxxxxxxxx"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
UPLOADTHING_SECRET="sk_xxxxxxxxxxxxx"
UPLOADTHING_APP_ID="xxxxxxxxxxxxx"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_NAME="Your Hotel Name"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

---

## Security Best Practices

### ✅ DO:

- Use different secrets for development and production
- Generate strong, random secrets (minimum 32 characters)
- Store production secrets in your hosting platform's dashboard
- Use test/sandbox credentials for development
- Rotate secrets regularly in production
- Keep `.env.local` in `.gitignore`
- Use environment-specific values

### ❌ DON'T:

- Commit `.env.local` or any file with real credentials to Git
- Share secrets in chat, email, or documentation
- Reuse the same secret across environments
- Use production credentials in development
- Expose server-side secrets to the client
- Use weak or predictable secrets

---

## Variable Naming Convention

### Client-Side Variables (Exposed to Browser)

Variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript and accessible in the browser.

**Examples:**

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_NAME`

**Security:** Only use for non-sensitive data that's safe to expose publicly.

### Server-Side Variables (Private)

Variables without the `NEXT_PUBLIC_` prefix are only available on the server.

**Examples:**

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY`

**Security:** These are never sent to the client and remain private.

---

## Validation

The application automatically validates all environment variables on startup using Zod schemas in `lib/env.ts`.

**Validation checks:**

- Required variables are present
- URLs are valid format
- Email addresses are valid format
- Secrets meet minimum length requirements
- Enum values are valid

**On validation failure:**

- Application won't start
- Detailed error messages in console
- Indicates which variables are missing/invalid

---

## Troubleshooting

### Error: "DATABASE_URL is required"

**Solution:** Add `DATABASE_URL` to your `.env.local` file with a valid PostgreSQL connection string.

### Error: "NEXTAUTH_SECRET must be at least 32 characters"

**Solution:** Generate a new secret with `openssl rand -base64 32` and update your `.env.local`.

### Error: "EMAIL_FROM must be a valid email address"

**Solution:** Ensure `EMAIL_FROM` is a properly formatted email address (e.g., `noreply@hotel.com`).

### Changes not taking effect

**Solution:** Restart your development server after changing environment variables.

### Production deployment issues

**Solution:**

1. Verify all variables are set in hosting platform dashboard
2. Check for typos in variable names
3. Ensure production URLs are correct (HTTPS, not HTTP)
4. Verify all secrets are production-ready (not test keys)

---

## Quick Setup Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Set up PostgreSQL database and add `DATABASE_URL`
- [ ] Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Sign up for Paystack and add API keys
- [ ] Sign up for Resend and add API key
- [ ] Sign up for Uploadthing and add credentials
- [ ] Update `NEXT_PUBLIC_APP_URL` if not using localhost:3000
- [ ] Restart development server
- [ ] Run `npx prisma generate && npx prisma migrate dev`
- [ ] Test the application

---

## Additional Resources

- [Full Setup Guide](./SETUP.md)
- [README](./README.md)
- [Paystack Documentation](https://paystack.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Uploadthing Documentation](https://docs.uploadthing.com)
- [NextAuth.js Documentation](https://next-auth.js.org)
