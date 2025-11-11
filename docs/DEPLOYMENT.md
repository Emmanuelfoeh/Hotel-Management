# Deployment Guide

This guide covers deploying the Hotel Management System to various platforms.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment](#vercel-deployment-recommended)
- [Railway Deployment](#railway-deployment)
- [Docker Deployment](#docker-deployment)
- [Manual VPS Deployment](#manual-vps-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Migration](#database-migration)
- [Post-Deployment Tasks](#post-deployment-tasks)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] All environment variables configured
- [ ] Database set up and accessible
- [ ] Paystack account configured (test or live mode)
- [ ] Resend account with verified sender domain
- [ ] Uploadthing account configured
- [ ] Code pushed to Git repository
- [ ] Production build tested locally (`npm run build && npm start`)
- [ ] All migrations are up to date
- [ ] Security review completed
- [ ] Backup strategy planned

## Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with zero configuration.

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/hotel-management-system.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Set Up Database

#### Option A: Vercel Postgres

1. In your Vercel project dashboard, go to **Storage**
2. Click **Create Database** > **Postgres**
3. Choose a region close to your users
4. Copy the connection string
5. It will be automatically added as `POSTGRES_URL` environment variable

#### Option B: External Database (Supabase, Railway, etc.)

1. Create a PostgreSQL database on your preferred platform
2. Copy the connection string
3. Add it as `DATABASE_URL` environment variable in Vercel

### Step 4: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** > **Environment Variables** and add:

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx

# Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@yourdomain.com

# File Upload
UPLOADTHING_SECRET=sk_xxx
UPLOADTHING_APP_ID=xxx

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Important**: Add variables for all environments (Production, Preview, Development)

### Step 5: Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Step 6: Run Database Migrations

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run db:migrate:deploy

# Seed database (optional)
npm run db:seed
```

### Step 7: Configure Custom Domain (Optional)

1. Go to **Settings** > **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to use your custom domain

### Step 8: Configure Webhooks

Update your Paystack webhook URL:

1. Go to Paystack Dashboard > Settings > Webhooks
2. Set URL to: `https://your-domain.vercel.app/api/webhooks/paystack`

## Railway Deployment

Railway provides a simple deployment experience with built-in PostgreSQL.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository

### Step 3: Add PostgreSQL Database

1. Click **New** > **Database** > **Add PostgreSQL**
2. Railway will automatically create a database
3. The `DATABASE_URL` will be automatically set

### Step 4: Configure Environment Variables

1. Click on your service
2. Go to **Variables** tab
3. Add all required environment variables (see Vercel section)

### Step 5: Configure Build Settings

Railway auto-detects Next.js, but you can customize:

1. Go to **Settings** tab
2. Set **Build Command**: `npm run build`
3. Set **Start Command**: `npm start`

### Step 6: Deploy

1. Railway will automatically deploy on push to main branch
2. Get your deployment URL from the **Settings** tab

### Step 7: Run Migrations

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run db:migrate:deploy

# Seed database
railway run npm run db:seed
```

## Docker Deployment

Deploy using Docker containers for maximum portability.

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/hotel_db
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - PAYSTACK_SECRET_KEY=${PAYSTACK_SECRET_KEY}
      - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=${NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - EMAIL_FROM=${EMAIL_FROM}
      - UPLOADTHING_SECRET=${UPLOADTHING_SECRET}
      - UPLOADTHING_APP_ID=${UPLOADTHING_APP_ID}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=hotel_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 3: Update next.config.ts

Add standalone output:

```typescript
const nextConfig = {
  output: 'standalone',
  // ... other config
};
```

### Step 4: Build and Run

```bash
# Build image
docker-compose build

# Run containers
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npm run db:seed

# View logs
docker-compose logs -f app
```

### Step 5: Deploy to Production

For production, use a container orchestration platform:

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Kubernetes**

## Manual VPS Deployment

Deploy to a VPS (Ubuntu/Debian) with Nginx reverse proxy.

### Step 1: Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Set Up Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE hotel_db;
CREATE USER hotel_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;
\q
```

### Step 3: Clone and Build Application

```bash
# Create app directory
sudo mkdir -p /var/www/hotel-management
sudo chown $USER:$USER /var/www/hotel-management

# Clone repository
cd /var/www/hotel-management
git clone https://github.com/yourusername/hotel-management-system.git .

# Install dependencies
npm ci

# Create .env.local
nano .env.local
# Add all environment variables

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate:deploy

# Build application
npm run build

# Seed database
npm run db:seed
```

### Step 4: Configure PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'hotel-management',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/hotel-management',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### Step 5: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/hotel-management

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/hotel-management /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Set Up Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Environment Configuration

### Production Environment Variables

```env
# Database (use connection pooling for serverless)
DATABASE_URL="postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=1"

# NextAuth (use production URL)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-random-secret-min-32-chars"

# Paystack (use live keys)
PAYSTACK_SECRET_KEY="sk_live_xxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_xxx"

# Email (use verified domain)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"

# File Upload
UPLOADTHING_SECRET="sk_xxx"
UPLOADTHING_APP_ID="xxx"

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_NAME="Your Hotel Name"

# Optional: Error Tracking
NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"
```

### Security Best Practices

1. **Use strong secrets**: Generate with `openssl rand -base64 32`
2. **Enable HTTPS**: Always use SSL in production
3. **Restrict database access**: Use firewall rules
4. **Use environment-specific keys**: Different keys for dev/staging/prod
5. **Rotate secrets regularly**: Change passwords and API keys periodically
6. **Enable rate limiting**: Protect against abuse
7. **Set up monitoring**: Track errors and performance
8. **Regular backups**: Automate database backups
9. **Keep dependencies updated**: Run `npm audit` regularly
10. **Use CSP headers**: Configure Content Security Policy

## Database Migration

### Running Migrations in Production

```bash
# For Vercel/Railway
vercel env pull .env.local
npm run db:migrate:deploy

# For Docker
docker-compose exec app npx prisma migrate deploy

# For VPS
cd /var/www/hotel-management
npm run db:migrate:deploy
pm2 restart hotel-management
```

### Rollback Strategy

```bash
# Create backup before migration
pg_dump -U user -d hotel_db > backup_$(date +%Y%m%d_%H%M%S).sql

# If migration fails, restore from backup
psql -U user -d hotel_db < backup_20241201_120000.sql
```

### Zero-Downtime Migrations

1. **Backward compatible changes**: Add new columns as nullable
2. **Deploy code first**: Deploy application that works with old and new schema
3. **Run migration**: Apply database changes
4. **Deploy final code**: Remove old schema support
5. **Clean up**: Remove old columns/tables

## Post-Deployment Tasks

### 1. Verify Deployment

```bash
# Check application is running
curl https://yourdomain.com

# Check API health
curl https://yourdomain.com/api/health

# Check database connection
# Login to admin and verify data loads
```

### 2. Configure Webhooks

Update webhook URLs in external services:

- **Paystack**: `https://yourdomain.com/api/webhooks/paystack`

### 3. Set Up Monitoring

#### Vercel Analytics

1. Go to your project dashboard
2. Enable Analytics
3. View real-time metrics

#### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

#### Uptime Monitoring

Use services like:

- UptimeRobot
- Pingdom
- StatusCake

### 4. Configure Backups

#### Automated Database Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-hotel-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/hotel-db"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U hotel_user hotel_db | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
EOF

# Make executable
sudo chmod +x /usr/local/bin/backup-hotel-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-hotel-db.sh
```

### 5. Update DNS Records

Point your domain to your deployment:

- **Vercel**: Add CNAME record pointing to `cname.vercel-dns.com`
- **Railway**: Add CNAME record from Railway dashboard
- **VPS**: Add A record pointing to your server IP

### 6. Test Email Delivery

```bash
# Send test email through admin dashboard
# Or use Resend dashboard to send test email
```

### 7. Change Default Credentials

```bash
# Login to admin dashboard
# Go to Staff Management
# Change admin password
# Or use Prisma Studio to update directly
```

## Monitoring and Maintenance

### Application Monitoring

```bash
# View logs (Vercel)
vercel logs

# View logs (Railway)
railway logs

# View logs (PM2)
pm2 logs hotel-management

# View logs (Docker)
docker-compose logs -f app
```

### Performance Monitoring

Monitor these metrics:

- Response time
- Error rate
- Database query performance
- Memory usage
- CPU usage
- Disk space

### Regular Maintenance Tasks

- [ ] Weekly: Review error logs
- [ ] Weekly: Check database size and performance
- [ ] Monthly: Update dependencies (`npm update`)
- [ ] Monthly: Review and rotate API keys
- [ ] Monthly: Test backup restoration
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance optimization review

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Check connection string format
# Ensure database is accessible from deployment environment
# Check firewall rules
```

### Environment Variable Issues

```bash
# Verify all required variables are set
# Check for typos in variable names
# Ensure NEXT_PUBLIC_ prefix for client-side variables
# Restart application after changing variables
```

### Payment Webhook Not Working

1. Verify webhook URL is correct in Paystack dashboard
2. Check webhook signature verification
3. Review webhook logs in Paystack dashboard
4. Test with Paystack webhook tester

### Email Not Sending

1. Verify Resend API key is correct
2. Check sender email is verified
3. Review Resend logs
4. Check email service rate limits

### Performance Issues

```bash
# Enable Next.js production profiling
NEXT_PROFILING=1 npm run build

# Analyze bundle size
npm run build -- --analyze

# Check database query performance
# Use Prisma query logging
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

## Support

For deployment issues:

- Check [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- Review platform-specific documentation
- Open an issue on GitHub
- Contact support@hotel.com

---

**Remember**: Always test deployments in a staging environment before deploying to production!
