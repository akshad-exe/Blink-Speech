# BlinkSpace Backend – Setup Guide

Step-by-step instructions to set up and run the BlinkSpace backend service locally.

---

## 1. Prerequisites

- **Node.js** >= 18.x and **npm** or **yarn**
- A **Supabase** project with credentials
- (Optional) A **Twilio** account for SMS

---

## 2. Clone the Repository

```sh
git clone https://github.com/your-org/blinkspace.git
cd blinkspace/backend
```

Or ensure the backend folder is inside your main BlinkSpace project.

---

## 3. Install Dependencies

```sh
npm install
```

Installs:
- **next** (API routes backend)
- **@supabase/supabase-js** (database)
- **twilio** (optional SMS)
- **dotenv** (env variables)

---

## 4. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**Notes:**
- **Never** commit `.env` to version control.
- `SUPABASE_SERVICE_ROLE_KEY` is secret; do not expose to frontend.

---

## 5. Database Setup (Supabase)

In the [Supabase SQL Editor](https://app.supabase.com/), run:

```sql
CREATE TABLE patterns (
  sid TEXT PRIMARY KEY,
  mapping JSONB
);
```

---

## 6. File Structure

```
backend/
├── pages/
│   └── api/
│       ├── patterns/
│       │   └── [sid].ts   # CRUD API for phrase mappings
│       └── sendSMS.ts     # Optional: SMS sending with Twilio
├── .env                   # Environment variables
├── package.json
├── SETUP.md
└── README.md
```

---

## 7. Running Locally

```sh
npm run dev
```

Backend will start on [http://localhost:3000](http://localhost:3000).

---

## 8. API Routes

- **GET /api/patterns/[sid]** – Fetch mapping for a specific session/user
- **POST /api/patterns/[sid]** – Save/update mapping
- **POST /api/sendSMS** – (Optional) Send SMS with Twilio

---

## 9. Deployment

### Vercel (Recommended)
1. Push code to GitHub repo
2. Import backend folder to Vercel as a separate project
3. Set environment variables in Vercel dashboard

### Other Node.js hosting
```sh
npm install
npm run build
npm start
```

---

## 10. Testing

- Ensure Supabase connection works (`GET /api/patterns/test-sid`)
- For SMS, make a `POST` request to `/api/sendSMS` with:
  ```json
  {
    "to": "+1234567890",
    "phrase": "Help needed!"
  }
  ```

---

**Backend is now ready to integrate with the React frontend.**