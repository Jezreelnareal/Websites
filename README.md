# Jezreel Borlongan Portfolio

A personal portfolio website for showcasing my work in web development, blockchain projects, video editing, and graphic design. The site is built with Next.js, TypeScript, and Tailwind CSS, with a clean dark interface inspired by modern developer portfolios.

## Overview

This portfolio presents my background, selected projects, creative work, and contact information in one responsive website. It includes project previews, CV-based content, service highlights, and a working contact form.

## Features

- Responsive homepage with video hero content
- Who Am I page with experience, projects, awards, and working stack
- Spotlights page for graphics, video editing, and web development highlights
- Project preview popup with overview, tech stack, and detailed explanation
- Contact page with a Resend-powered email form
- Smooth scroll reveal and hover interactions across pages

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

## Project Structure

```text
app/              Pages, layouts, and API routes
components/       Reusable interface components
lib/              Portfolio data and shared logic
public/           Images, videos, and static assets
```

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
