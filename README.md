# Doraquants Frontend

A modern trading dashboard built with Next.js 14, featuring AI-driven analytics and portfolio intelligence.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with dark theme
- **Chart.js** and **react-chartjs-2** for data visualization
- **Responsive design** optimized for all devices
- **Glass morphism** UI effects
- **Gradient backgrounds** and modern aesthetic

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Font**: Inter (Google Fonts)
- **Build Tools**: PostCSS, Autoprefixer

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   └── ChartExample.tsx    # Example chart component
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json                # Dependencies
```

## Components

### ChartExample
A responsive chart component showcasing portfolio performance data using Chart.js with a dark theme.

### Layout
Root layout with:
- Inter font family
- Dark gradient background
- Glass morphism effects
- Responsive design utilities

## Styling

The project uses a dark theme with:
- **Primary gradient**: Gray-900 → Gray-800 → Black
- **Glass effects**: Semi-transparent backgrounds with blur
- **Gradient text**: Blue → Purple → Pink gradients
- **Custom scrollbar**: Dark themed scrollbar

## Integration

This frontend is designed to work with the Doraquants backend API located in `/backend`. It will fetch:
- Portfolio data
- Trading analytics
- Market data
- Account information

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [React Chart.js 2 Documentation](https://react-chartjs-2.js.org/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
