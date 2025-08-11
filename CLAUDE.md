# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm ci

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests without watch mode (for CI)
npm test -- --watchAll=false

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## Architecture Overview

This is a React application for generating Inspection Data Sheets (IDS) with Excel export functionality. The application follows a feature-based architecture:

### Core Application Structure
- **App.jsx**: Main router with routes for IDS page (`/`), dashboard (`/dashboard`), and 404
- **AppLayout.jsx**: Common layout wrapper with Honda-themed header and Material-UI ThemeProvider
- **theme.js**: Custom Material-UI theme with Honda red (#da251d) primary color and Yu Gothic font

### Feature Modules

#### Part Details (`src/features/PartDetails/`)
- Manages part information form (part number, name, supplier, model, etc.)
- Handles validation for required fields and checkboxes (side selection, drawing purpose)

#### Inspection Items (`src/features/InspectionItems/`)
- **useGroupedItems.js**: Core hook managing inspection items state with grouping logic
- **ItemForm.jsx**: Form for adding/editing inspection items with tolerance types
- **ItemsTable.jsx**: Table displaying grouped inspection items
- Supports tolerance types from `constants/tolerance.js` with special handling for XY coordinates and Min/Max values

#### Excel Export (`src/features/Export/`)
- **excelExporter.js**: Handles Excel template population and download
- Uses `xlsx-populate` library to modify Excel templates via named ranges
- **prepareExportRows()**: Transforms grouped items into Excel-compatible row format
- Template file: `public/template.xlsx`

### Key Data Structures

#### Tolerance System
- Tolerance types organized in groups (Form, Orientation, Location, Profile, Runout, Other)
- Special handling for tolerances that don't require LSL (Lower Specification Limit)
- XY coordinate support for Position and Radial tolerances
- Min/Max support for Profile tolerances

#### Item Grouping
- Items are grouped by `groupId` with potential sub-items (X, Y coordinates or Min, Max values)
- Main item has no `subitem` field, sub-items have descriptive `subitem` values
- Each item has validation for required fields based on item type (Variable vs Attribute)

## Testing

- Jest test runner with React Testing Library
- Test files located in `__tests__` directories within feature folders
- Tests cover utility functions like `useGroupedItems.js` and `excelExporter.js`

## Code Quality Tools

- **ESLint**: Configured with React and Prettier integration (see `.eslintrc.json`)
- **Prettier**: Code formatting with lint-staged pre-commit hooks
- **Husky**: Git hooks configured for automated linting and formatting

## Material-UI Integration

The application uses Material-UI v7 with:
- Custom Honda-themed color palette
- Yu Gothic font family
- Default button styling (small, outlined)
- Responsive design with Stack and Box layout components