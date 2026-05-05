# Markflow

Markflow is a modern web editor for writing Markdown documents and Marp presentations with real-time preview and export options.

## ✨ Features

- Markdown & Marp authoring
- Split-view editing and preview
- Export to Markdown, HTML, and PDF/Print
- Optional AI-assisted editing (requires a Gemini API key)

## 🧰 Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Monaco Editor
- Marp

## 🚀 Getting Started

### Requirements

- Node.js 18+
- npm (or your preferred package manager)

### Install

```bash
npm install
```

### Configure (Optional)

To enable AI features, create a `.env.local` file:

```bash
GEMINI_API_KEY=your_api_key
```

### Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and the PR process.

## 🧭 Code of Conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior through the channels listed there.

## 📄 License

Licensed under the [MIT License](LICENSE).
