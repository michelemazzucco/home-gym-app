# Home Gym App

A Next.js app that analyzes photos of home gym equipment and provides AI-powered workout plans.

## Features

- Take photos or upload images of your gym equipment
- Select difficulty level (beginner, intermediate, advanced)
- AI-powered equipment identification using OpenAI `gpt-4o-mini`
- Generate personalized workout plans
- Copy workout plans to clipboard

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. Take a photo or upload an image of your home gym equipment
2. Select your preferences (level, sessions per week, and number of weeks)
3. Click "Let's go!" to analyze the image
4. View the identified equipment and generated workout plan
5. Copy the plan to your clipboard for later use