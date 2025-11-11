# Troubleshooting Guide

This guide helps you resolve common issues when developing or deploying the Hotel Management System.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Payment Issues](#payment-issues)
- [Email Issues](#email-issues)
- [File Upload Issues](#file-upload-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Performance Issues](#performance-issues)
- [UI and Styling Issues](#ui-and-styling-issues)
- [Getting Help](#getting-help)

## Installation Issues

### npm install fails

**Problem**: Dependencies fail to install

**Solutions**:

1. Clear npm cache:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version:

   ```bash
   node --version  # Should be 18.17 or higher
   ```

3. Update npm:

   ```bash
   npm install -g npm@latest
   ```

4. Try using different registry:
   ```bash
   npm install --registry=https://registry.npmjs.org/
   ```

### Prisma generate fails

**Problem**: `npm run db:generate` fails

**Solutions**:

1. Check DATABASE_URL is set:

   ```bash
   echo $DATABASE_URL
   ```

2. Ensure PostgreSQL is running:

   ```bash
   # macOS
   brew services list

   # Ubuntu
   sudo service postgresql status
   ```

3. Regenerate Prisma Client:
   ```bash
   npx prisma generate --force
   ```

### Port 3000 already in use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:

1. Find and kill the process:

   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Use a different port:
   ```bash
   PORT=3001 npm run dev
   ```

## Database Issues

### Cannot connect to database

**Problem**: `Error: Can't reach database server`

**Solutions**:

1. Verify PostgreSQL is running:

   ```bash
   # macOS
   brew services start postgresql@14

   # Ubuntu
   sudo service postgresql start

   # Docker
   docker ps | grep postgres
   ```

2. Check DATABASE_URL format:

   ```env
   # Correct format
   DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"

   # Common mistakes
   # ❌ Missing protocol: user:password@localhost:5432/hotel_db
   # ❌ Wrong protocol: postgres://... (should be postgresql://)
   # ❌ Missing port: postgresql://user:password@localhost/hotel_db
   ```

3. Test connection:

   ```bash
   psql "postgresql://user:password@localhost:5432/hotel_db"
   ```

4. Check firewall rules:
   ```bash
   # Allow PostgreSQL port
   sudo ufw allow 5432
   ```

### Migration fails

**Problem**: `Error: Migration failed to apply`

**Solutions**:

1. Check migration status:

   ```bash
   npx prisma migrate status
   ```

2. Reset database (development only):

   ```bash
   npx prisma migrate reset
   ```

3. Apply migrations manually:

   ```bash
   npx prisma migrate deploy
   ```

4. Resolve migration conflicts:

   ```bash
   # Mark migration as applied
   npx prisma migrate resolve --applied "migration_name"

   # Mark migration as rolled back
   npx prisma migrate resolve --rolled-back "migration_name"
   ```

### Database schema out of sync

**Problem**: Prisma Client doesn't match database schema

**Solutions**:

1. Regenerate Prisma Client:

   ```bash
   npx prisma generate
   ```

2. Push schema changes:

   ```bash
   npx prisma db push
   ```

3. Create new migration:
   ```bash
   npx prisma migrate dev --name fix_schema
   ```

### Seed script fails

**Problem**: `npm run db:seed` fails

**Solutions**:

1. Check if database is empty:

   ```bash
   npx prisma studio
   ```

2. Clear existing data:

   ```bash
   npx prisma migrate reset
   ```

3. Run seed manually:

   ```bash
   npx tsx prisma/seed.ts
   ```

4. Check for unique constraint violations in seed data

## Authentication Issues

### Cannot login

**Problem**: Login fails with correct credentials

**Solutions**:

1. Check NEXTAUTH_SECRET is set:

   ```bash
   echo $NEXTAUTH_SECRET
   ```

2. Verify NEXTAUTH_URL matches your domain:

   ```env
   # Development
   NEXTAUTH_URL="http://localhost:3000"

   # Production
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. Clear browser cookies and try again

4. Check password hash in database:

   ```bash
   npx prisma studio
   # Verify staff record exists with hashed password
   ```

5. Reset admin password:
   ```bash
   npm run db:seed  # This will reset to default credentials
   ```

### Session not persisting

**Problem**: User gets logged out immediately

**Solutions**:

1. Check session configuration in `lib/auth.ts`

2. Verify cookies are enabled in browser

3. Check NEXTAUTH_SECRET is consistent across restarts

4. Clear browser cache and cookies

5. Check for CORS issues if using custom domain

### Unauthorized errors

**Problem**: `401 Unauthorized` or `403 Forbidden` errors

**Solutions**:

1. Verify user is logged in:

   ```typescript
   const session = await auth();
   console.log('Session:', session);
   ```

2. Check user role:

   ```typescript
   if (session?.user?.role !== 'MANAGER') {
     // User doesn't have permission
   }
   ```

3. Review middleware configuration in `middleware.ts`

4. Check route protection in layouts

## Payment Issues

### Paystack initialization fails

**Problem**: Cannot initialize payment

**Solutions**:

1. Verify Paystack keys are set:

   ```bash
   echo $PAYSTACK_SECRET_KEY
   echo $NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
   ```

2. Check key format:

   ```env
   # Test keys
   PAYSTACK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."

   # Live keys
   PAYSTACK_SECRET_KEY="sk_live_..."
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_..."
   ```

3. Verify amount is in kobo (multiply by 100):

   ```typescript
   // Correct
   amount: 5000 * 100; // ₦5000 = 500000 kobo

   // Wrong
   amount: 5000; // This is ₦50
   ```

4. Check Paystack account status

### Webhook not receiving events

**Problem**: Payment webhook not being called

**Solutions**:

1. Verify webhook URL in Paystack dashboard:

   ```
   https://yourdomain.com/api/webhooks/paystack
   ```

2. Check webhook signature verification:

   ```typescript
   const hash = crypto
     .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
     .update(JSON.stringify(req.body))
     .digest('hex');

   if (hash !== signature) {
     return new Response('Invalid signature', { status: 400 });
   }
   ```

3. Test webhook locally with ngrok:

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start tunnel
   ngrok http 3000

   # Use ngrok URL in Paystack dashboard
   https://abc123.ngrok.io/api/webhooks/paystack
   ```

4. Check webhook logs in Paystack dashboard

5. Verify webhook endpoint is accessible:
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/paystack
   ```

### Payment verification fails

**Problem**: Cannot verify payment status

**Solutions**:

1. Check reference format:

   ```typescript
   // Reference should match what was sent to Paystack
   const reference = `booking_${bookingId}_${Date.now()}`;
   ```

2. Verify Paystack API response:

   ```typescript
   console.log('Verification response:', response);
   ```

3. Check for network issues

4. Ensure payment was actually completed

## Email Issues

### Emails not sending

**Problem**: Email notifications not being sent

**Solutions**:

1. Verify Resend API key:

   ```bash
   echo $RESEND_API_KEY
   ```

2. Check sender email is verified:
   - Go to Resend dashboard
   - Verify your domain or email

3. Check email service logs:

   ```typescript
   console.log('Email result:', result);
   ```

4. Test email manually:

   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "noreply@yourdomain.com",
       "to": "test@example.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

5. Check rate limits in Resend dashboard

### Emails going to spam

**Problem**: Emails are marked as spam

**Solutions**:

1. Verify sender domain with SPF, DKIM, and DMARC records

2. Use a verified domain (not Gmail, Yahoo, etc.)

3. Improve email content:
   - Add proper headers
   - Include unsubscribe link
   - Avoid spam trigger words
   - Use proper HTML structure

4. Check sender reputation

5. Test with mail-tester.com

## File Upload Issues

### Upload fails

**Problem**: Cannot upload images

**Solutions**:

1. Verify Uploadthing credentials:

   ```bash
   echo $UPLOADTHING_SECRET
   echo $UPLOADTHING_APP_ID
   ```

2. Check file size limits:

   ```typescript
   // In app/api/uploadthing/core.ts
   maxFileSize: '4MB'; // Adjust as needed
   ```

3. Verify file type is allowed:

   ```typescript
   image: {
     maxFileSize: "4MB",
     maxFileCount: 10,
   }
   ```

4. Check browser console for errors

5. Test with smaller file

### Images not displaying

**Problem**: Uploaded images don't show

**Solutions**:

1. Check image URL format:

   ```typescript
   // Should be full URL
   https://uploadthing.com/f/abc123.jpg
   ```

2. Verify images array in database:

   ```bash
   npx prisma studio
   # Check room.images field
   ```

3. Check Next.js Image configuration:

   ```typescript
   // next.config.ts
   images: {
     domains: ['uploadthing.com'],
   }
   ```

4. Check CORS settings

## Build and Deployment Issues

### Build fails

**Problem**: `npm run build` fails

**Solutions**:

1. Check TypeScript errors:

   ```bash
   npx tsc --noEmit
   ```

2. Fix linting errors:

   ```bash
   npm run lint
   ```

3. Clear Next.js cache:

   ```bash
   rm -rf .next
   npm run build
   ```

4. Check for missing environment variables:

   ```bash
   # Build requires all NEXT_PUBLIC_ variables
   ```

5. Increase Node.js memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### Deployment fails

**Problem**: Deployment to Vercel/Railway fails

**Solutions**:

1. Check build logs for errors

2. Verify all environment variables are set

3. Ensure DATABASE_URL is accessible from deployment

4. Check for missing dependencies in package.json

5. Verify Node.js version in deployment settings

### Database migrations fail in production

**Problem**: Migrations don't run on deployment

**Solutions**:

1. Run migrations manually:

   ```bash
   # Vercel
   vercel env pull
   npm run db:migrate:deploy

   # Railway
   railway run npm run db:migrate:deploy
   ```

2. Check database connection from deployment environment

3. Verify migration files are committed to git

4. Check for migration conflicts

## Performance Issues

### Slow page loads

**Problem**: Pages take too long to load

**Solutions**:

1. Enable Next.js caching:

   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

2. Optimize database queries:

   ```typescript
   // Use select to fetch only needed fields
   const rooms = await db.room.findMany({
     select: {
       id: true,
       name: true,
       price: true,
     },
   });
   ```

3. Add database indexes:

   ```prisma
   @@index([status])
   @@index([type])
   ```

4. Optimize images:

   ```typescript
   <Image
     src={room.image}
     width={400}
     height={300}
     quality={75}
     loading="lazy"
   />
   ```

5. Use React Server Components where possible

### High memory usage

**Problem**: Application uses too much memory

**Solutions**:

1. Check for memory leaks in components

2. Limit data fetching:

   ```typescript
   // Add pagination
   const rooms = await db.room.findMany({
     take: 20,
     skip: page * 20,
   });
   ```

3. Clear unused dependencies:

   ```bash
   npm prune
   ```

4. Optimize bundle size:
   ```bash
   npm run build -- --analyze
   ```

### Slow database queries

**Problem**: Database queries are slow

**Solutions**:

1. Add indexes to frequently queried fields

2. Use database query logging:

   ```typescript
   // In lib/db.ts
   const db = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

3. Optimize queries:

   ```typescript
   // Bad: N+1 query problem
   const bookings = await db.booking.findMany();
   for (const booking of bookings) {
     const room = await db.room.findUnique({ where: { id: booking.roomId } });
   }

   // Good: Use include
   const bookings = await db.booking.findMany({
     include: { room: true },
   });
   ```

4. Use connection pooling

5. Consider read replicas for reporting

## UI and Styling Issues

### Dark mode not working

**Problem**: Dark mode toggle doesn't work

**Solutions**:

1. Check ThemeProvider is wrapping app:

   ```typescript
   // app/layout.tsx
   <ThemeProvider attribute="class" defaultTheme="system">
     {children}
   </ThemeProvider>
   ```

2. Verify Tailwind dark mode configuration:

   ```typescript
   // tailwind.config.ts
   darkMode: 'class',
   ```

3. Clear browser cache

4. Check for CSS conflicts

### Styles not applying

**Problem**: Tailwind classes don't work

**Solutions**:

1. Verify Tailwind is configured:

   ```bash
   # Check tailwind.config.ts exists
   # Check globals.css imports Tailwind
   ```

2. Restart development server:

   ```bash
   npm run dev
   ```

3. Check for typos in class names

4. Verify content paths in tailwind.config.ts:
   ```typescript
   content: [
     './app/**/*.{js,ts,jsx,tsx,mdx}',
     './components/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   ```

### Responsive design broken

**Problem**: Layout breaks on mobile

**Solutions**:

1. Test with browser dev tools

2. Check for fixed widths:

   ```typescript
   // Bad
   <div className="w-[1200px]">

   // Good
   <div className="w-full max-w-7xl">
   ```

3. Use responsive utilities:

   ```typescript
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
   ```

4. Test on actual devices

## Getting Help

If you're still experiencing issues:

### 1. Check Documentation

- README.md
- docs/API.md
- docs/DEPLOYMENT.md
- CONTRIBUTING.md

### 2. Search Issues

- Check [GitHub Issues](https://github.com/yourusername/hotel-management-system/issues)
- Search for similar problems

### 3. Enable Debug Logging

```typescript
// Add to your code
console.log('Debug info:', { variable1, variable2 });

// Enable Prisma query logging
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### 4. Create an Issue

If you can't find a solution, create a new issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error messages and logs
- Screenshots if applicable

### 5. Contact Support

- Email: support@hotel.com
- GitHub Discussions: [Link to discussions]

## Common Error Messages

### "Module not found"

- Run `npm install`
- Check import paths
- Restart dev server

### "Cannot find module '@/...' "

- Check tsconfig.json paths configuration
- Verify file exists
- Restart TypeScript server in VS Code

### "Hydration failed"

- Check for mismatched HTML between server and client
- Ensure no browser extensions are modifying HTML
- Check for invalid HTML nesting

### "ECONNREFUSED"

- Service is not running
- Check port number
- Verify firewall settings

### "CORS error"

- Check API route configuration
- Verify domain in NEXTAUTH_URL
- Check browser console for details

---

**Remember**: When troubleshooting, always check the logs first. Most issues can be diagnosed from error messages and stack traces.
