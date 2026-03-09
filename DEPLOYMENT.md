# SaaS WMS Platform Deployment Guide

This guide explains how to deploy the SaaS Warehouse Management System (WMS) built with Next.js and Google Sheets.

## Prerequisites

-   Node.js 18+
-   Google Cloud Account
-   Vercel Account
-   GitHub Account

## 1. Google Sheets & Service Account Setup

Since we are using Google Sheets as a database, we need a Service Account to access it programmatically.

### Step 1.1: Create a Google Cloud Project
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., `saas-wms-platform`).
3.  Enable the **Google Sheets API** and **Google Drive API** for this project.

### Step 1.2: Create a Service Account
1.  Go to **IAM & Admin** > **Service Accounts**.
2.  Click **Create Service Account**.
3.  Name it (e.g., `wms-backend`).
4.  Grant it the **Editor** role (or specifically Sheets Editor).
5.  Click **Done**.

### Step 1.3: Generate Keys
1.  Click on the newly created service account email.
2.  Go to the **Keys** tab.
3.  Click **Add Key** > **Create new key** > **JSON**.
4.  A JSON file will download. **Keep this safe!** It contains your private key.

### Step 1.4: Create the Google Sheet Database
1.  Create a new Google Sheet.
2.  Name it `SaaS WMS Database`.
3.  Share this sheet with the **Service Account Email** (found in the JSON file, usually `wms-backend@...iam.gserviceaccount.com`) as an **Editor**.
4.  Copy the **Sheet ID** from the URL (it's the long string between `/d/` and `/edit`).

### Step 1.5: Initialize Sheets
Create the following sheets (tabs) in your Google Sheet:
-   `organizations`
-   `users`
-   `products`
-   `inventory`
-   `inventory_movements`
-   `orders`
-   `asn`
-   `receiving`
-   `picking`
-   `shipping`

Add header rows to each sheet (e.g., `id`, `name`, `email`, etc.).

## 2. Local Development Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file based on `.env.example`:
    ```env
    GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email"
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    GOOGLE_SHEET_ID="your-sheet-id"
    JWT_SECRET="your-secret-key"
    ```
    *Note: For `GOOGLE_PRIVATE_KEY`, copy the value from the JSON file. If it has `\n` characters, keep them.*

4.  Run the development server:
    ```bash
    npm run dev
    ```

## 3. GitHub & Vercel Deployment

### Step 3.1: Push to GitHub
1.  Create a new repository on GitHub.
2.  Push your code:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/your-username/saas-wms.git
    git push -u origin main
    ```

### Step 3.2: Deploy to Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New** > **Project**.
3.  Import your GitHub repository.
4.  In the **Environment Variables** section, add:
    -   `GOOGLE_SERVICE_ACCOUNT_EMAIL`
    -   `GOOGLE_PRIVATE_KEY` (Copy the entire private key string, including `-----BEGIN...`)
    -   `GOOGLE_SHEET_ID`
    -   `JWT_SECRET`
5.  Click **Deploy**.

## 4. Production Configuration

### Handling Private Keys in Vercel
Vercel handles newlines in environment variables well, but sometimes you might need to replace `\n` with actual newlines in your code. The provided `lib/googleSheets.ts` handles this:
```ts
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
```

### Scaling
Google Sheets has API rate limits (60 requests per minute per user). For a production SaaS with many users, you should migrate to a real database like PostgreSQL (e.g., Vercel Postgres, Supabase, or Neon).

To migrate:
1.  Replace `lib/googleSheets.ts` with a Prisma or Drizzle ORM client.
2.  Update the API routes to use the new client.
3.  The rest of the application logic remains the same.

## 5. Future Roadmap
-   [ ] Implement full RBAC with middleware.
-   [ ] Add barcode scanning support (using mobile camera).
-   [ ] Integrate with shipping carriers (FedEx, UPS API).
-   [ ] Add webhooks for external integrations (Shopify, WooCommerce).
