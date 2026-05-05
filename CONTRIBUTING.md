# Contributing to Markflow

Thanks for taking the time to contribute! This project welcomes improvements, bug fixes, documentation updates, and ideas.

## Ground Rules

- Be respectful and collaborative. Please read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Keep changes focused and scoped to the issue you are addressing.
- Prefer small, reviewable pull requests.

## Getting Started

1. Fork the repository and create your branch from `main`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Configure AI features by creating a `.env.local` file with:

   ```bash
   GEMINI_API_KEY=your_api_key
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Development Workflow

- Run linting before submitting:

  ```bash
  npm run lint
  ```

- Ensure the production build succeeds:

  ```bash
  npm run build
  ```

## Reporting Issues

- Use GitHub Issues for bugs and feature requests.
- Include steps to reproduce, expected behavior, and screenshots/logs when helpful.

## Submitting Pull Requests

- Describe the problem and the solution clearly.
- Link related issues in your PR description.
- Update documentation if your change affects user-facing behavior.

Thank you for helping improve Markflow! 🚀
