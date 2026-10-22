# Janawaaz.in (जनआवाज़) — राजस्थान जन-संवाद एवं जनमत पोर्टल
### Janawaaz.in – Citizen Opinion & Public Grievance Platform

A production-grade, mobile-first, bilingual (Hindi-first with English switch) web application and administrative feedback analytics portal built for **Janawaaz.in (जनआवाज़)** — dedicated to transparent civic engagement and independent public opinion polling across Rajasthan. Featured active poll: **Independent Sarpanch Candidate Shri Mohan Singh Ji, Gram Panchayat Budivada (बुड़ीवाड़ा)**.

---

## 🌟 1. Project Overview & Guiding Philosophy

This portal provides a transparent digital bridge between village residents and independent candidate Shri Mohan Singh Ji's team. It is designed to understand ground-level problems across all wards, gather public expectations, collect constructive suggestions, and provide an administrative analytics dashboard to guide community development priorities without political bias.

### Key Guiding Principles:
- **No Fabricated Information**: The candidate's biography, vision, village development priorities, FAQs, announcements, and contact hours are fully editable via the secure Admin CMS panel.
- **Strict Political Anonymity**: The voluntary public opinion poll is 100% anonymous. No names, phone numbers, exact addresses, device IDs, or tracking cookies are ever collected for opinion responses.
- **Data Segregation**: Optional citizen contact details for grievance follow-ups are stored in a completely separate database collection (`followup_requests`) with explicit consent, strictly isolated from political opinion data.
- **Rural Community-Centric Design**: Warm cream background sections, deep agricultural emerald green accents, high-contrast typography, large touch targets for mobile users, and Hindi-first Devanagari typography.

---

## 🏗️ 2. Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Language**: TypeScript (Strict typing for all database models)
- **Styling**: Tailwind CSS with custom village green, warm cream, and earth color palettes
- **Typography**: Google Noto Sans Devanagari & Plus Jakarta Sans
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualizations**: [Recharts](https://recharts.org/) (Bar charts, Pie/Donut charts)
- **Backend & Database**: Firebase Authentication for admin identity, MongoDB for application records, and Firestore rules for remaining client-side Firebase data
- **Local Demo Mode**: Uses seeded in-process data during local development; production requires MongoDB and server-side Firebase Admin credentials.

---

## 📱 3. Application Architecture & Pages

### A. Public Website (ग्रामवासियों के लिए सार्वजनिक पोर्टल)

| Route | Page Name (Hindi / English) | Key Features |
|---|---|---|
| `/` | मुख्य पृष्ठ (Home Page) | Candidate introduction, category badge, village priority pillars, live anonymized community stats, urgent announcement banner, quick-action grievance buttons |
| `/about` | प्रत्याशी परिचय (About Candidate) | Objective candidate vision, no fabricated promises, guiding principles, comprehensive FAQs, visiting hours |
| `/feedback` | समस्या व सुझाव फॉर्म (Grievance Form) | 10 problem categories, urgency selection (High/Medium/Low), ward/mohalla, improvement textarea, anti-spam math challenge, separate consent-based follow-up contact section |
| `/issues` | गाँव की प्राथमिकताएँ (Village Priorities) | Public aggregate dashboard, category percentage bars, high-priority issues count, moderated suggestions (zero personal identity shown) |
| `/opinion` | स्वैच्छिक राय-शुमारी (Opinion Poll) | Anonymous binary opinion poll with live aggregate breakdown; personal details are not collected in the voting flow |
| `/privacy` | गोपनीयता नीति (Privacy Policy) | Plain-language transparency policy detailing anonymity, data segregation, citizen rights, and non-commercial data usage |

### B. Secure Admin Panel (अधिकृत प्रशासनिक पोर्टल)

| Route | Page Name | Key Features |
|---|---|---|
| `/admin/login` | व्यवस्थापक लॉगिन (Admin Login) | Firebase Auth login checked against the Firestore `admins` collection; local demo credentials are development-only |
| `/admin/dashboard` | डैशबोर्ड अवलोकन (Dashboard Overview) | Real-time metric cards (total problems, unique records, high-priority, pending, resolved), Recharts bar & pie charts, recent submissions table |
| `/admin/feedback` | समस्या प्रबंधन (Feedback Management) | Category/priority/status filters, text search, inline status updater (`pending` \| `under_review` \| `addressed` \| `resolved`), internal admin notes, public visibility toggle, CSV export, consent follow-up inspector |
| `/admin/analytics` | सांख्यिकी व जनमत (Analytics & Polls) | In-depth aggregated poll percentages, category volume rankings, priority distributions, immutable administrative audit log trail |
| `/admin/content` | वेबसाइट सामग्री (Content CMS) | Live management of candidate bio, village priority pillars, public announcements, FAQs, and office contact information |

---

## 🗄️ 4. Database Schema & Collections

| Collection | Description | Access Permissions |
|---|---|---|
| `site_content` | Stores editable candidate bio, village priorities, announcements, FAQs, and contact info | Public: Read-only<br>Admin: Read & Write |
| `public_feedback` | Grievance records (category, description, improvement, priority, ward, status, notes) | Public: Create (validated) & Read (only if `moderationStatus == 'approved'`)<br>Admin: Full Read, Write, Update |
| `anonymous_opinions` | Anonymous poll votes (`responseId`, `selectedOption`, `createdAt`). Strictly NO PII. | Public: Create only (strictly validated)<br>Public Read: FORBIDDEN<br>Admin: Read-only for aggregate stats |
| `followup_requests` | Optional resident contact details for site inspections. Stored with explicit consent. | Public: Create only with `consentToContact == true`<br>Public Read: FORBIDDEN<br>Admin: Full Read & Write |
| `admins` | Verified administrators with role mapping (`superadmin`, `admin`, `moderator`) | Public: FORBIDDEN<br>Admin: Restricted to verified admins |
| `audit_logs` | Immutable audit trail of administrative actions | Public: FORBIDDEN<br>Admin: Read & Create only (updates forbidden) |

---

## 🚀 5. Quick Start & Local Development

### Prerequisites
- Node.js version 18 or higher (v20+ recommended)
- npm or yarn

### 1. Clone & Install
```bash
cd /Users/rameshsuthar/Downloads/voterApp
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

> **Note on Out-of-the-Box Mode**:
> You can run the application locally without Firebase or MongoDB. Demo data and changes are held in development process memory and are not durable. Production requires Firebase Auth/Admin setup and a reachable MongoDB database.
>
> **Default Local Admin Credentials**:
> - **Email**: `admin@budivada.in`
> - **Password**: `budivada2026`

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 6. Firebase Production Setup

### Step 1: Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Name your project (e.g., `budivada-sarpanch`).
3. Click on the Web icon (`</>`) to register a web app and copy your Firebase configuration credentials.

### Step 2: Configure Environment Variables
Update `.env.local` with your project's credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=budivada-sarpanch.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=budivada-sarpanch
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=budivada-sarpanch.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
ADMIN_SECRET_KEY=generate-a-strong-random-key-here
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=budivada_sarpanch
FIREBASE_PROJECT_ID=budivada-sarpanch
# Configure FIREBASE_SERVICE_ACCOUNT_KEY with a service-account JSON secret,
# or use Google Application Default Credentials on the server.
```

The API stores application records in MongoDB. Configure `MONGODB_URI` to a reachable production database; production API writes fail rather than reporting success if MongoDB is unavailable. Admin API routes also verify Firebase ID tokens and require the signed-in UID to exist in Firestore's `admins` collection. Configure server-side Firebase Admin credentials with `FIREBASE_SERVICE_ACCOUNT_KEY` (store the full service-account JSON as a deployment secret) or Google Application Default Credentials.

### Step 3: Enable Authentication & Firestore
1. In Firebase Console, navigate to **Build -> Authentication** and enable the **Email/Password** sign-in method.
2. Navigate to **Build -> Firestore Database** and click **Create database** (select standard production mode).
3. Configure a Firebase Admin service account for the server using `FIREBASE_SERVICE_ACCOUNT_KEY` or Google Application Default Credentials. Never commit the service-account key.
4. Configure `MONGODB_URI` and `MONGODB_DB` for the server-side application database.

### Step 4: Deploy Hardened Security Rules
The file `firestore.rules` has already been authored and hardened in the root directory. Deploy it using Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore # Choose 'Use an existing project' and keep firestore.rules
firebase deploy --only firestore:rules
```

### Step 5: Provision the Initial Administrator
Run the included setup script:
```bash
node scripts/create-admin.js admin@budivada.in YourStrongPassword2026!
```
*Alternatively, you can manually create the user in the Firebase Console under Authentication -> Users, then add a document in Firestore collection `admins` where Document ID = User UID, with fields `{ uid: "<UID>", email: "admin@budivada.in", role: "superadmin", createdAt: "2026-10-14T00:00:00Z" }`.*

---

## 🧪 7. Verification & Testing Instructions

1. **Public Grievance Submission Flow**:
   - Visit `/feedback`
   - Select category (e.g. `पेयजल व्यवस्था`)
   - Fill in description and improvement
   - Verify that the anti-spam math challenge validates inputs
   - Check the optional consent checkbox and enter contact details
   - Submit and verify the success confirmation message
2. **Public Issues Dashboard**:
   - Visit `/issues`
   - Confirm that your submitted problem appears (without personal contact details!)
   - Filter by category and observe real-time distribution bars
3. **Anonymous Opinion Poll**:
   - Visit `/opinion`
   - Cast an anonymous opinion (e.g. `मैं श्री मोहन सिंह जी का समर्थन करता/करती हूँ।`)
   - Confirm that aggregated percentage charts update immediately
   - Verify that no name or phone is requested
4. **Admin Panel**:
   - Visit `/admin/login`
   - Log in using `admin@budivada.in` / `budivada2026`
   - Inspect key metric cards and Recharts charts on `/admin/dashboard`
   - Navigate to `/admin/feedback`, filter by priority, edit status to `addressed`, add internal notes, and click **CSV में डाउनलोड करें**
   - Navigate to `/admin/content`, edit candidate bio or add a new village priority, save and check that it reflects immediately on the public website

---

## 🚢 8. Production Deployment Guide

### Deploying to Vercel
1. Push your code to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local` in **Project Settings -> Environment Variables**.
4. Click **Deploy**.

### Building for Self-Hosted Node.js / Docker
```bash
npm run build
npm start
```

---

## ⚖️ 9. Ethical & Legal Notice

This application is built strictly for community engagement, grievance redressal, and participatory planning for Gram Panchayat Budivada. It adheres to data minimization and privacy-by-design standards:
- It does not conduct predictive election polling or claim to represent total voter turnout.
- Political opinions are never linked to personal identities.
- All administrative updates are logged in an immutable audit trail.
