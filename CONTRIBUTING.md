# Contributing to Hotel Management System

Thank you for your interest in contributing to the Hotel Management System! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 18.17 or higher
- npm 9 or higher
- PostgreSQL 14 or higher
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/your-username/hotel-management-system.git
   cd hotel-management-system
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/original-owner/hotel-management-system.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

6. **Set up database**:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript and JavaScript Language Features

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-room-filters`)
- `fix/` - Bug fixes (e.g., `fix/booking-date-validation`)
- `docs/` - Documentation updates (e.g., `docs/update-api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/booking-service`)
- `test/` - Adding tests (e.g., `test/room-actions`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

### 3. Commit Your Changes

Follow the commit guidelines (see below):

```bash
git add .
git commit -m "feat: add room filtering by amenities"
```

### 4. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use type inference where appropriate

```typescript
// Good
interface BookingData {
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
}

function createBooking(data: BookingData): Promise<Booking> {
  // Implementation
}

// Bad
function createBooking(data: any): any {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Implement error boundaries where appropriate

```typescript
// Good
interface RoomCardProps {
  room: Room;
  onSelect: (roomId: string) => void;
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
  return (
    <div onClick={() => onSelect(room.id)}>
      <h3>{room.name}</h3>
      <p>{room.price}</p>
    </div>
  );
}

// Bad
export function RoomCard(props: any) {
  return <div>{props.room.name}</div>;
}
```

### Server Actions

- Always validate inputs with Zod
- Handle errors gracefully
- Return consistent response format
- Add proper authentication checks

```typescript
// Good
export async function createRoom(data: CreateRoomInput) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'MANAGER') {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = roomSchema.parse(data);
    const room = await db.room.create({ data: validated });

    return { success: true, room };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to create room' };
  }
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use shadcn/ui components when possible
- Maintain consistent spacing and colors

```tsx
// Good
<div className="flex flex-col gap-4 p-6 rounded-lg border bg-card">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// Bad
<div style={{ display: 'flex', padding: '24px' }}>
  <h2 style={{ fontSize: '24px' }}>Title</h2>
</div>
```

### File Organization

- Keep related files together
- Use index files for exports
- Follow the existing directory structure
- Name files consistently (kebab-case)

```
components/
├── admin/
│   ├── forms/
│   │   ├── room-form.tsx
│   │   ├── booking-form.tsx
│   │   └── index.ts
│   └── index.ts
```

### Code Formatting

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

We use ESLint for code quality:

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```bash
# Feature
git commit -m "feat(booking): add date range validation"

# Bug fix
git commit -m "fix(payment): handle failed payment webhook"

# Documentation
git commit -m "docs(api): update booking endpoints documentation"

# Refactoring
git commit -m "refactor(room-service): simplify availability check logic"

# Breaking change
git commit -m "feat(auth)!: migrate to NextAuth v5

BREAKING CHANGE: NextAuth v4 is no longer supported"
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 72 characters
- Reference issues and PRs in the footer
- Explain what and why, not how

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] All tests pass
- [ ] No linting errors
- [ ] Build succeeds locally

### PR Title

Follow the same format as commit messages:

```
feat(booking): add calendar view for bookings
```

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #123

## Changes Made

- Added calendar view component
- Integrated react-big-calendar
- Added date navigation controls

## Screenshots (if applicable)

[Add screenshots here]

## Testing

- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile
- [ ] Tested dark mode

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
- [ ] Tests pass
```

### Review Process

1. **Automated Checks**: CI/CD will run linting, type checking, and build
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"
git push origin feature/your-feature-name
```

## Testing Guidelines

### Manual Testing

Before submitting a PR, test:

1. **Functionality**: Feature works as expected
2. **Edge Cases**: Handle invalid inputs, empty states
3. **Responsive Design**: Works on mobile, tablet, desktop
4. **Dark Mode**: Looks good in both themes
5. **Browser Compatibility**: Test on major browsers
6. **Performance**: No significant performance degradation

### Testing Checklist

- [ ] Happy path works correctly
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] Form validation works
- [ ] API errors are handled gracefully
- [ ] UI is responsive
- [ ] Dark mode works
- [ ] Accessibility is maintained

## Documentation

### When to Update Documentation

Update documentation when you:

- Add a new feature
- Change existing functionality
- Add or modify API endpoints
- Change environment variables
- Update deployment process
- Fix a bug that affects usage

### Documentation Files

- `README.md` - Project overview and setup
- `docs/API.md` - API routes and server actions
- `docs/DEPLOYMENT.md` - Deployment instructions
- `CONTRIBUTING.md` - This file
- Code comments - Complex logic explanation

### Writing Good Documentation

- Be clear and concise
- Include code examples
- Add screenshots for UI changes
- Keep it up to date
- Use proper formatting

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify it's actually a bug and not expected behavior
3. Test on the latest version
4. Gather relevant information

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Screenshots

If applicable

## Environment

- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 18.17.0]
- Version: [e.g., 1.0.0]

## Additional Context

Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature

## Problem It Solves

What problem does this feature address?

## Proposed Solution

How should this feature work?

## Alternatives Considered

Other solutions you've considered

## Additional Context

Mockups, examples, or references
```

### Feature Discussion

- Open an issue with the `feature-request` label
- Discuss the feature with maintainers
- Wait for approval before starting work
- Create a PR once approved

## Questions?

If you have questions:

- Check existing documentation
- Search closed issues
- Open a new issue with the `question` label
- Email: support@hotel.com

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project website (if applicable)

Thank you for contributing to the Hotel Management System! 🎉
