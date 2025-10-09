# Contributing to Mastra Visual Builder

Thank you for your interest in contributing to the Mastra Visual Builder! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/mastra-agent-builder.git
   cd mastra-agent-builder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Run tests**
   ```bash
   pnpm test
   ```

## 🎯 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** and provide:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Feature Requests

For new features:

1. **Check existing feature requests** first
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

#### Types of Contributions

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Test coverage**

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   pnpm test
   pnpm test:coverage
   pnpm build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Coding Standards

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code is automatically formatted with Prettier
- **Naming**: Use camelCase for variables, PascalCase for components

### Component Guidelines

- **Functional Components**: Use React functional components with hooks
- **Props Interface**: Define TypeScript interfaces for component props
- **Default Props**: Use default parameters instead of defaultProps
- **Styling**: Use Tailwind CSS classes for styling

### File Organization

```
src/
├── components/          # React components
│   ├── builder/        # Builder-specific components
│   ├── canvas/         # Canvas-related components
│   ├── panels/         # Configuration panels
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── store/              # State management
├── types/              # TypeScript type definitions
└── styles.css          # Global styles
```

### Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(canvas): add drag and drop functionality
fix(validation): resolve schema validation error
docs(readme): update installation instructions
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Writing Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { BuilderToolbar } from '../BuilderToolbar';

describe('BuilderToolbar', () => {
  it('renders toolbar buttons', () => {
    render(<BuilderToolbar />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## 🎨 UI/UX Guidelines

### Design Principles

- **Dark Theme First**: All components should work well in dark mode
- **Accessibility**: Follow WCAG guidelines for contrast and keyboard navigation
- **Consistency**: Use the established design system
- **Responsive**: Ensure components work on different screen sizes

### Component Design

- **Props Interface**: Always define TypeScript interfaces
- **Default Values**: Provide sensible defaults
- **Error Handling**: Handle edge cases gracefully
- **Loading States**: Show loading indicators for async operations

### Styling Guidelines

- **Tailwind CSS**: Use Tailwind classes for styling
- **CSS Variables**: Use CSS custom properties for theming
- **Responsive**: Use responsive prefixes (sm:, md:, lg:)
- **Dark Mode**: Use dark: prefix for dark mode styles

## 📚 Documentation

### Code Documentation

- **JSDoc**: Document complex functions and components
- **Type Definitions**: Use descriptive TypeScript interfaces
- **README Updates**: Update README.md for new features

### Example Documentation

```typescript
/**
 * Configuration panel for agent nodes
 * @param config - Agent configuration object
 * @param onChange - Callback when configuration changes
 * @param onSave - Callback when configuration is saved
 */
interface AgentConfigPanelProps {
  config: AgentConfig;
  onChange: (config: AgentConfig) => void;
  onSave: () => void;
}
```

## 🔄 Pull Request Process

### Before Submitting

1. **Test thoroughly** - Run all tests and ensure they pass
2. **Check linting** - Fix any ESLint errors
3. **Update documentation** - Update README or other docs if needed
4. **Squash commits** - Clean up commit history if necessary

### PR Template

When creating a PR, include:

- **Description**: What changes were made and why
- **Type**: Bug fix, feature, documentation, etc.
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking Changes**: If any, describe them

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Maintainers review the code
3. **Testing**: Changes are tested in different environments
4. **Approval**: PR is approved and merged

## 🐛 Bug Reports

### Before Reporting

1. **Check existing issues** for similar problems
2. **Try the latest version** to see if the issue is fixed
3. **Test in different browsers** if it's a browser-specific issue

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped
- [ ] Release notes are written

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be patient** with newcomers
- **Be collaborative** in discussions

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check existing docs first

## 📞 Contact

- **Maintainer**: Khaled Garbaya
- **Issues**: [GitHub Issues](https://github.com/khaledgarbaya/mastra-agent-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/khaledgarbaya/mastra-agent-builder/discussions)

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

Thank you for contributing to Mastra Visual Builder! 🚀
