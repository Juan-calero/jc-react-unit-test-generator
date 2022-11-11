# jc-react-unit-test-generator README

JC Unit test generator is a simple plugin that reads react files and generates jest unit test boilerplate files.

## Usage

1. After installation, right-click on a folder, or on a .ts/.tsx file.
2. Click on the option "JC: Generate Unit Tests".
3. Enjoy your newly generated unit test.

Works on:

- TS and TSX React Hooks
- TS and TSX React Components
- Folders that contain these types of files

## (Important) Best Practices

This file must obey **certain conventions** in order for the generator to work:

1. File Name:

- File name must be in kebab case (example: `my-beautiful-component.tsx`)
- In order to generate a React Hook template, file name must start with 'use' (example: `use-my-beautiful-hook.tsx`)
- Generator skips index files (`index.ts`, `index.tsx`, ...), style files (`.styles.` and `.style.` files'), and test files (`.test.` files, `.spec.` files, and any file inside `__test__` or `__spec__`)

2. File Contents:

- File must only contain 1 named export (excluding type exports, example: `export const MyBeatifulComponent`)
- The generator automatically skips mocking `SCREAMING_SNAKE_CASE`, `tokens` and `icon` imports, as it considers them to not require mocking.

---

## Known Issues

- Generating Unit Tests on Folders with more than 3 files will not display the vscode info/error message.

## Release Notes

### 0.0.1

Initial release 🚀

### 0.0.3

Added documentation and added a logo.
