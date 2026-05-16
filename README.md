# RFQ Quote Comparison AI

RFQ Quote Comparison AI helps procurement teams compare 2–5 supplier quote PDFs, review extracted line items, normalize similar parts, and export a side-by-side recommendation.

## What is included

- PDF upload with editable supplier names
- AI extraction with server-only credentials
- Editable review tables and low-confidence flags
- Conservative item matching and supplier comparison
- Excel export plus print/PDF styling
- Supabase auth, history, RLS, and private file storage
- Stripe subscriptions with a Free / Pro model
- Vercel-ready hardening, security headers, and health checks

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local`.
3. Fill in the environment variables you need.
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open the local app URL printed by Next.js.

## AI provider setup

Phase 1 ships with an OpenAI-first adapter behind a provider interface:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
```

To test the workflow without an API key, use **Use mock sample data** on the upload screen.

## Supabase setup

1. Create a Supabase project.
2. Add these values to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   SUPABASE_STORAGE_BUCKET=quote-pdfs
   ```
3. Run the SQL migrations in `supabase/migrations/` in order.
4. Confirm the `quote-pdfs` bucket exists and remains private.
5. Enable email/password auth in Supabase Auth settings.

## Stripe setup

1. Create a recurring Pro price in Stripe.
2. Add:
   ```env
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   STRIPE_PRICE_ID_PRO=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   NEXT_PUBLIC_APP_URL=
   ```
3. Point a Stripe webhook endpoint at `/api/stripe/webhook`.
4. Subscribe the endpoint to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## How to use

1. Sign up or log in.
2. Open **New comparison** from the dashboard.
3. Upload 2–5 PDF quotes or use mock mode.
4. Review and edit the extracted line items.
5. Enter a comparison title and generate the result.
6. Export to Excel or print to PDF.

## Vercel deployment

1. Add every variable from `.env.example` to the Vercel project.
2. Set `NEXT_PUBLIC_APP_URL` to the production domain.
3. Deploy the project.
4. Verify `/api/health`.
5. Reconfigure the Stripe webhook endpoint to the production URL.

## Security notes

- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `STRIPE_SECRET_KEY` are server-only.
- Quote PDFs are stored only in a private Supabase bucket after Phase 2 and are accessed with short-lived signed URLs.
- The initial extraction request processes uploaded PDFs transiently and does not save them permanently.
- Row Level Security restricts database rows to their owning user.

## Common errors

- **Upload rejected:** make sure every file is a PDF and 10 MB or smaller.
- **Extraction fails:** verify `OPENAI_API_KEY`, `OPENAI_MODEL`, and the uploaded PDF content.
- **Dashboard is empty:** run the migrations and confirm auth works.
- **Checkout fails:** verify Stripe keys, the Pro price ID, and `NEXT_PUBLIC_APP_URL`.
- **PDF links fail:** confirm the storage bucket is private and migrations created the storage policy.
