# Homegym

Get workouts based on what's around you, powered by AI magic ✨

_Inspired by [@Doriandarko](https://github.com/Doriandarko) poem-cam_

## How to Use 📒

1. Take a photo or upload an image of your home gym equipment
2. Select your preferences (level, sessions per week, and number of weeks)
3. Click "Let's go!" to analyze the image
4. View the identified equipment and generated workout plan
5. Copy the plan to your clipboard for later use

## Sneak peeks 👀

### Home
![Home page](docs/assets/home.png)

### Result
![Result page](docs/assets/result.png)

### Videos (mobile) 

You can also see the app in action here:
- Full workflow [here](https://www.dropbox.com/scl/fi/rljs59sgowvgg7mslxc65/full-workflow.MP4?rlkey=1v81p275zg7rtrcepqusmwlcn&e=1&st=7abjfk95&dl=0)
- Example with a random object (i.e. chair) [here](https://www.dropbox.com/scl/fi/rljs59sgowvgg7mslxc65/full-workflow.MP4?rlkey=1v81p275zg7rtrcepqusmwlcn&st=7abjfk95&dl=0)

## Setup ⚙️

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
