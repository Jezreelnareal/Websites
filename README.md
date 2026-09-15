# Jezreel Borlongan Portfolio

A personal portfolio for web development, blockchain projects, video editing, and graphic design. Built with Next.js, TypeScript, and Tailwind CSS, with charcoal backgrounds, warm gold accents, and locally hosted DM Sans and Instrument Serif fonts.

## Overview

This portfolio presents my background, selected projects, creative work, and contact information in one responsive website. It includes project previews, CV-based content, service highlights, and a working contact form.

## Features

- Original video hero and floating navigation, followed by scroll-driven 3D certificate chapters
- Full-height project stages, scroll-scaled titles, and pointer-responsive previews
- Layered creative work with visible-only video playback and expandable journey stories
- About page with experience, projects, education, competitions, and a working toolkit
- Work page with category links and full-size graphics and video previews
- Native preview dialogs with keyboard focus handling and Escape-to-close
- Resend contact form with Cloudflare Turnstile verification, native field validation, and retry feedback
- Responsive navigation, keyboard focus styles, and reduced-motion support
- Videos use local poster frames and pause offscreen or when the tab is hidden

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Resend
- Vercel

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open the site in your browser:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build and checks TypeScript.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs ESLint.

## Environment Variables

Create a `.env.local` file in the project root. You can copy the values from `.env.example` and replace them with your real credentials:

```env
RESEND_API_KEY=your_resend_api_key_here
CONTACT_TO_EMAIL=jezreelborlongan7@gmail.com
RESEND_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

The contact form needs these variables to send messages successfully.

### Cloudflare verification setup

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Turnstile** and choose **Add widget**.
2. Name it `Portfolio inquiries`, add your portfolio hostname (for example `your-portfolio.vercel.app` and your custom domain), and choose **Managed** mode. Enter hostnames without `https://` or paths. Configure each environment's allowed hostnames in Cloudflare.
3. Copy the **site key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.local`. The site key is public.
4. Copy the **secret key** into `TURNSTILE_SECRET_KEY` in `.env.local`. Keep it server-only: never prefix it with `NEXT_PUBLIC_`, commit it, or place it in client code.
5. Add both variables to your deployment's environment settings as well (for example Vercel), then redeploy. Restart the local dev server after changing keys; the public site key is included at build time.

The dark verification widget appears above **Send message**. Sending stays disabled until verification succeeds. `/api/contact` independently validates the token with Cloudflare before calling Resend, including the `contact` action. Missing configuration, invalid or expired tokens, and verification outages block submission. After each attempt, the widget refreshes; a failed send preserves the draft.

For local development, use a separate widget that allows `localhost`, or Cloudflare's [documented test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/). Never use test keys in production. No test keys or verification bypass are enabled automatically.

Implementation reference: [Cloudflare server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Run the contact endpoint's isolated verification tests with `node --test tests/contact-route.test.mjs`. These mock Cloudflare and Resend; they never send email.

### Call requests

On `/lets-talk`, visitors can choose **Send an inquiry** or **Request a call**.
A call request is for a 30-minute introduction, with the preferred date and time
explicitly entered in **Philippine time (Asia/Manila, UTC+8)**. Both the form and
the API reject past times; the API also rejects invalid dates.

Requests use the same Cloudflare verification and Resend configuration as inquiries.
You receive a styled **Call Request** email with the proposed time, discussion topic,
and the visitor's reply-to address. Reply manually to agree on a time and provide
the meeting link. The form and email label requests as **pending confirmation**.
There is no automatic booking, calendar reservation, or visitor confirmation email.
No additional environment variables or calendar account are required.

The **Reply to sender** link opens your configured email app with the recipient,
subject, and a draft message filled in. Call drafts include the requested date,
time, timezone, duration, and a meeting-link placeholder. Review the proposed time,
replace the placeholder with your meeting link, and send the reply to confirm.
Inquiry drafts include the project and any supplied timeline, with space for your
response. Opening the link does not send anything or reserve an appointment.

## Certificate showcase

The section directly after the homepage hero previews AWS and Trend Micro at
`/#certificates`, side by side on desktop and stacked on mobile. Each preview has
a rotating, draggable badge, a short summary, and a link to the full collection.
The dedicated `/certificates` page presents every badge in its own
scroll chapter. Badges slowly spin automatically while visible, with additional rotation from scroll progress, in front
of oversized certificate titles, with descriptions and contributions below.
Drag and release to spin with momentum that gradually slows, or use left/right arrow keys for manual rotation. The index links jump to
individual certificates. Reduced-motion preferences show stationary badges and
remove the extended sticky scroll; browsers without WebGL show static previews.

Edit `lib/certificates.ts` to update the collection. Trend Micro uCTF includes
the supplied participation certificate for the August 22, 2025 preliminary round.
AWS Cloud Quest links to the public Credly training badge issued September 10, 2026;
the Python and Morph entries remain experience previews.
To add an actual certificate:

1. Put its PDF or image in `public/certificates/`.
2. Set the entry's `documentUrl`, for example `/certificates/my-certificate.pdf`.
3. Update its title, `displayLines`, issuer, year, skills, and `contribution`, and
   change `kind` to `certificate`.
4. Optionally set `badgeImage` to local PNG/JPG badge artwork and
   `verificationUrl` to the issuer's public verification link.

For an online training badge, set `kind` to `badge` and provide its
`verificationUrl`. A PDF is optional when the badge has a public issuer record.

The badge artwork maps to the shield face; portrait artwork works best.
Keep the full certificate as `documentUrl` so visitors can read the original.
The Python badge uses the unmodified logo from the [Python Software Foundation's logo page](https://www.python.org/community/logos/).

## Project Structure

```text
app/              Pages, layouts, and API routes
components/       Reusable interface components
lib/              Portfolio data and shared logic
public/           Images, videos, and static assets
```

Shared layout and typography live in `app/globals.css`; badge styles live in
`app/certificates.css`. The rest of the site's stage layouts and interactions use
`app/experience.css` and `components/scene-motion.tsx`. Project and gallery content is in `lib/data.ts`, and
video poster frames are stored in `public/posters/`.

## Deployment

This project is ready to deploy on Vercel.

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy the project.

For the contact form to work on the live site, the Resend environment variables must be added in Vercel Project Settings.

## Author

Jezreel Borlongan

- GitHub: [Jezreelnareal](https://github.com/Jezreelnareal)
- Email: jezreelborlongan7@gmail.com

## Notes

- Do not commit `.env.local` or any real API keys.
- Keep public media files inside the `public/` folder.
- `.env.example` is safe to commit because it only contains placeholder values.
