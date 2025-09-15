# Homegym

Get workouts based on what's around you, powered by AI magic ✨

_Inspired by [@Doriandarko](https://github.com/Doriandarko) poem-cam_

## The problem

Many of us have accumulated home gym equipment, but finding workout plans that actually use what we own is surprisingly difficult. Most online plans either leave some equipment gathering dust or push you to buy more gear, cluttering up your garage or living space even further.

## My solution

Create personalized workout plans based on your actual equipment. But let's be honest—sometimes we're too lazy to catalog everything we have. That's where AI comes in: simply scan your equipment and get a tailored, effective workout plan designed around what you already own.

https://github.com/user-attachments/assets/e6e35d53-39c9-4694-bdea-4368c8caca4c

### Mobile PWA
The app works on mobile as well, giving you the chance to actually take the picture from the app.

<div>
<img width="320" alt="Home page" src="docs/assets/pwa-home.PNG" />
<img width="320" alt="Result page" src="docs/assets/pwa-result.PNG" />
</div>

#### See it in action here:
- Full workflow [here](https://www.dropbox.com/scl/fi/rljs59sgowvgg7mslxc65/full-workflow.MP4?rlkey=1v81p275zg7rtrcepqusmwlcn&e=1&st=7abjfk95&dl=0)
- Example with a random object (i.e. chair) [here](https://www.dropbox.com/scl/fi/rljs59sgowvgg7mslxc65/full-workflow.MP4?rlkey=1v81p275zg7rtrcepqusmwlcn&st=7abjfk95&dl=0)

## How to Use

1. Take a photo or upload an image of your home gym equipment
2. Select your preferences (level, sessions per week, and number of weeks)
3. Click "Let's go!" to analyze the image
4. Check the identified equipment and tailored workout plan
5. Copy the plan to your clipboard for later use

## Local setup

Wanna try this app? Here are the steps to have it working on your laptop :)

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
