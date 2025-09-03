# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that uses OpenAI's gpt-4o-mini model to analyze photos of home gym equipment and generate personalized 12-week workout plans. The app supports both camera capture and file uploads with real-time image processing.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture

### Core Structure

- **Next.js 15 App Router**: Uses the modern app directory structure
- **Single Page Application**: All functionality contained in the root page component
- **API Route**: Single `/api/analyze` endpoint handles image processing and OpenAI integration
- **Client-Side State**: React hooks manage camera, file uploads, and workout results
- **UI Components**: Uses Base UI components from https://base-ui.com/llms.txt

### Key Components

- **Image Capture**: HTML5 camera API with front/back camera switching
- **File Upload**: Supports JPEG, PNG, GIF, WebP with 7.5MB size limit
- **OpenAI Integration**: Sends base64-encoded images to gpt-4o-mini for equipment identification and workout generation
- **Result Display**: Shows generated workout plans with copy-to-clipboard functionality

### File Organization

```
app/
├── layout.tsx          # Root layout with metadata
├── page.tsx           # Main application component (244 lines)
└── api/analyze/
    └── route.ts       # OpenAI API integration endpoint
```

## Configuration

### Environment Variables

Required in `.env.local` (use `.env.local.example` as template):

- `OPENAI_API_KEY` - OpenAI API key for gpt-4o-mini access

### TypeScript Configuration

- Uses strict mode with ES2017 target
- Path aliases configured: `@/*` maps to `./*`
- Standard Next.js TypeScript setup

### Image Processing Constraints

- Maximum file size: 7.5MB (raw), 10MB (base64)
- Supported formats: JPEG, PNG, GIF, WebP
- Base64 encoding used for OpenAI API transmission

## Key Implementation Details

### Camera Functionality

- Uses `navigator.mediaDevices.getUserMedia()` for camera access
- Supports switching between front (`user`) and back (`environment`) cameras
- Canvas-based photo capture with JPEG compression (0.8 quality)

### OpenAI Integration

- Model: `gpt-4o-mini` with vision capabilities
- Max tokens: 2000
- Expects structured JSON response with equipment list and workout plan
- Comprehensive error handling for API failures and size limits

### State Management

- Pure React hooks (useState, useRef)
- No external state management library
- Form data handling via FormData API for file uploads

## Common Development Patterns

When working with this codebase:

- Camera permissions are handled gracefully with fallback to file upload
- All user-facing errors use `alert()` for immediate feedback
- Image validation occurs both client-side and server-side
- Base64 encoding is used consistently for image transmission
- TypeScript interfaces define all data structures (`DifficultyLevel`, `WorkoutResult`)
