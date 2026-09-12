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
- Resend contact form with native field validation and retry feedback
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
```

The contact form needs these variables to send messages successfully.

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
