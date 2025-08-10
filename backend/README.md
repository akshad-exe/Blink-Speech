# BlinkSpace Backend

Backend service for **BlinkSpace**, handling:

- Storing and retrieving user **gesture → phrase** mappings in Supabase
- Providing secure REST API endpoints for frontend integration
- Optional Twilio integration for sending phrase-triggered SMS alerts

---

## Features

- **Supabase Database** (`patterns` table with JSONB mapping)
- **CRUD API** for gesture mappings
- **Optional SMS Sending** (Twilio)
- Built with **Next.js API routes** (Node.js backend)

---

## Tech Stack

| Technology               | Purpose                         |
|--------------------------|---------------------------------|
| Next.js API Routes       | Backend API framework           |
| Supabase                 | Cloud PostgreSQL + Realtime DB  |
| Twilio                   | SMS messaging                   |
| dotenv                   | Environment variable management |

---

## Quick Start

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Create `.env` file:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Twilio (optional)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

3. **Create Supabase table:**
   ```sql
   CREATE TABLE patterns (
     sid TEXT PRIMARY KEY,
     mapping JSONB
   );
   ```

4. **Run the backend:**
   ```sh
   npm run dev
   ```

---

## API Endpoints

### 1. GET `/api/patterns/[sid]`
Retrieve mapping for a given `sid` (session/user ID).

**Response:**
```json
{
  "mapping": {
    "doubleBlink_lookLeft": "Help",
    "tripleBlink_lookRight": "Yes"
  }
}
```

---

### 2. POST `/api/patterns/[sid]`
Save or update mapping.

**Request Body:**
```json
{
  "mapping": {
    "doubleBlink_lookLeft": "Help me",
    "lookUp": "Water please"
  }
}
```

---

### 3. POST `/api/sendSMS` *(Optional)*
Send an SMS with Twilio.

**Request Body:**
```json
{
  "to": "+14155552671",
  "phrase": "Emergency help needed!"
}
```

---

## Deployment

Recommended: Deploy to **Vercel**.  
Set all environment variables in the hosting provider's settings.

---
