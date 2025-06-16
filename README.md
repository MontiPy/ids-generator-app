# IDS Generator App

A React application for generating Inspection Data Sheets.

## Setup

Use the standard npm commands:

```bash
npm ci       # install dependencies
npm start    # run the development server
npm run build  # build for production
npm test     # run tests
```

## Running tests

Execute `npm test` to launch the Jest test runner. Use `npm test -- --watchAll=false` inside CI environments.

## Contributing

1. Fork the repository and create a new branch for your changes.
2. Run `npm ci` to install dependencies and `npm run lint` to check code style.
3. Submit a pull request with a clear description of your changes.

## Features

- Manage part information and inspection items.
- Export populated data sheets to Excel based on the current application state.

## Project structure

- `src/` - React components and features
- `public/` - static assets
