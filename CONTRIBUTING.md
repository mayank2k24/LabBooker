# Contributing to LabBooker

Thank you for your interest in contributing to LabBooker! We welcome contributions from the community to help improve and grow this project. This document outlines the process for contributing to LabBooker.

## Project Structure

LabBooker is a full-stack application with a React frontend and a Node.js/Express backend. Here's a high-level overview of the project structure:
labBooker/
├── cypress/                 # End-to-end tests
├── docs/                    # Project documentation
├── src/
│   ├── Backend-API/         # Backend server code
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   └── utils/
│   └── Frontend/
│       └── client/          # React frontend code
│           ├── public/
│           └── src/
│               ├── components/
│               ├── context/
│               └── tests/
├── .babelrc
├── .env
├── .gitignore
├── cypress.config.js
├── jest.config.js
├── package.json
└── README.md

## Getting Started

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Install dependencies by running `npm install` in both the root directory and the `src/Frontend/client` directory.
4. Create a `.env` file in the root directory and add necessary environment variables (refer to `.env.example` if available).

## Development Workflow

1. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bug-fix`.
2. Make your changes in the appropriate files.
3. Write or update tests as necessary.
4. Run tests to ensure your changes don't break existing functionality:
   - For backend: `npm run test` in the root directory
   - For frontend: `npm run test` in the `src/Frontend/client` directory
5. Commit your changes with a descriptive commit message.
6. Push your branch to your forked repository.
7. Create a pull request from your branch to the main LabBooker repository.

## Coding Standards

- Follow the existing code style and conventions used in the project.
- Use meaningful variable and function names.
- Write clear comments for complex logic.
- Keep functions small and focused on a single task.
- Use ES6+ features where appropriate.

## Testing

- Write unit tests for new functionality.
- Update existing tests if you modify functionality.
- Ensure all tests pass before submitting a pull request.

## Documentation

- Update the README.md file if you add new features or change existing ones.
- Document any new API endpoints in the appropriate files.
- Update this CONTRIBUTING.md file if you change the contribution process.

## Code Review Process

Once you submit a pull request:

1. Maintainers will review your code.
2. They may request changes or ask questions.
3. Make necessary updates and push new commits to your branch.
4. Once approved, a maintainer will merge your pull request.

Thank you for contributing to LabBooker!
