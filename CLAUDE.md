# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that uses OpenAI's gpt-4o-mini model to analyze photos of home gym equipment and generate personalized workout plans. The app supports both camera capture and file uploads with real-time image processing. Users can customize workout duration (4-12 weeks), sessions per week (1-7), and difficulty level (beginner/intermediate/advanced). API key can be provided by the user or configured via environment variables.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture

### Core Structure

- **Next.js 15 App Router**: Uses the modern app directory structure
- **Multi-Page Application**: Home page for input, result page for workout display
- **API Route**: Single `/api/analyze` endpoint handles image processing and OpenAI integration
- **Context-Based State**: AppContext manages global state (image, settings, workout results, API key)
- **UI Components**: Uses Base UI components from https://base-ui.com/llms.txt
- **Toast Notifications**: Custom toast system for user feedback

### Key Components

- **Image Upload**: Drag-and-drop or click to upload. Supports JPEG, PNG, GIF, WebP with automatic server-side optimization
- **Image Optimization**: Uses Sharp library to automatically resize/compress images server-side to stay under 3MB before base64 encoding
- **OpenAI Integration**: Sends base64-encoded images to gpt-4o-mini for equipment identification and workout generation
- **Result Display**: Shows generated workout plans organized by blocks and sessions with equipment badges
- **API Key Management**: Modal dialog for users to provide their own OpenAI API key (appears automatically in production)

### File Organization

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx               # Home page with form
├── result/
│   └── page.tsx           # Workout result display page
├── context/
│   └── AppContext.tsx     # Global state management
├── hooks/
│   └── useToast.tsx       # Toast notification hook
├── components/            # Reusable UI components
│   ├── Form/             # Image upload and settings form
│   ├── ApiDialog/        # API key input modal
│   ├── WorkoutBlock/     # Workout block display
│   ├── Button/           # Button component
│   ├── Select/           # Select dropdown
│   ├── NumberField/      # Number input
│   └── ...               # Other UI components
└── api/analyze/
    └── route.ts          # OpenAI API integration endpoint
```

## Configuration

### Environment Variables

Optional in `.env.local` (use `.env.local.example` as template):

- `OPENAI_API_KEY` - OpenAI API key for gpt-4o-mini access (can also be provided by user via UI)

### TypeScript Configuration

- Uses strict mode with ES2017 target
- Path aliases configured: `@/*` maps to `./*`
- Standard Next.js TypeScript setup

### Image Processing

- Supported formats: JPEG, PNG, GIF, WebP
- Server-side optimization using Sharp: automatically resizes/compresses images to stay under 3MB
- Progressive quality reduction (90 down to 10) and dimension scaling until target size achieved
- Base64 encoding used for OpenAI API transmission (kept under 4MB limit)
- Image detail level: 'low' for cost optimization
- No client-side size restrictions - all images accepted and optimized server-side

## Key Implementation Details

### OpenAI Integration

- Model: `gpt-4o-mini` with vision capabilities
- Max tokens: 2000
- Expects structured JSON response with equipment list and workout plan
- Images automatically optimized via Sharp before sending to API
- Comprehensive error handling for API failures

### State Management

- React Context API (AppContext) for global state
- Local React hooks (useState, useRef) for component-specific state
- Form data handling via FormData API for file uploads
- State persisted during navigation between home and result pages

## Common Development Patterns

When working with this codebase:

- User feedback is provided via toast notifications (useToast hook)
- Image file type validation occurs client-side (Form component), size optimization handled server-side (API route)
- Sharp library handles all image resizing/compression server-side to meet OpenAI requirements
- Base64 encoding is used consistently for image transmission
- TypeScript interfaces define all data structures (`DifficultyLevel`, `WorkoutResult`)
- API key flexibility: accepts user-provided key via form or environment variable
- Mobile detection using `is-mobile` library for adaptive UI text
