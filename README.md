# BeingConsultant Coaching Platform

A comprehensive coaching platform designed to help aspiring and current consultants advance their careers through personalized coaching, resources, and community support.

## Project Overview

BeingConsultant (also referred to as "ConsultCoach" in some parts of the UI) is a Next.js application that provides a structured environment for consultant career development. The platform offers various coaching options, learning resources, and community features to support users in their consulting journey.

## Tech Stack

- **Framework**: Next.js 15.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Shadcn UI (based on Radix UI primitives)
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Tailwind CSS animations
- **State Management**: React useState/useEffect hooks

## Key Features

### Authentication System
- Login and signup pages with email/password authentication
- Social login options (Google, Apple) UI
- Password reset functionality

### Dashboard
A comprehensive dashboard with:
- Overview statistics (sessions, progress, resources, achievements)
- Upcoming sessions tracker
- Recently accessed resources
- Interactive guided tour for new users
- Welcome modal for first-time visitors

### Coaching Options
- Land Consulting Offer program
- Unlimited Coaching
- Group Coaching sessions
- 1:1 Coaching appointments
- Star Consultant development program

### AI Coach
- AI-powered coaching demo
- Instant guidance and support

### Resources
- Personality Assessment tools
- Consulting Cheatsheets
- Meditation guides
- CV & Cover Letter templates and guides

### Learning Center
- Case Interview preparation
- Consulting Frameworks
- Industry Insights
- Webinars and training sessions

### Community
- Events calendar
- Discussion forums
- Success stories from other consultants

## Application Structure

The application follows the Next.js App Router pattern:

```
coaching-platform/
├── app/                      # Main application routes
│   ├── auth/                # Authentication routes
│   ├── dashboard/           # Dashboard and feature routes
│   ├── components/          # App-specific components
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/               # Reusable UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and shared code
├── public/                   # Static assets
├── styles/                   # Additional CSS files
└── package.json              # Project dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd beingconsultant/coaching-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:3000

## Current State

The application is in active development with the UI components implemented and ready for backend integration. Authentication and data operations are currently simulated with timeouts rather than actual API calls.

## Project Vision

BeingConsultant aims to be a comprehensive platform that provides:
- Expert coaching to help users break into and succeed in consulting
- Structured learning paths for skill development
- Community support for networking and knowledge sharing
- AI-assisted coaching for immediate guidance
- Personalized resources based on user needs and progress

---

Created with Next.js and modern web technologies to provide an optimal user experience for consultant career development.
