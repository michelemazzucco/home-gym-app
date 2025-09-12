# Setup

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