# Test Writer - Examples

## Mocker les dépendances

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de module
vi.mock('@/infrastructure/database/connection');

// Mock de fonction
const mockSave = vi.fn();

// Restaurer les mocks
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Templates par type de fichier

### Composant React

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  describe('Rendering', () => {
    it('should render with provided props', () => {
      // Arrange
      const props = { title: 'Test Title' };

      // Act
      render(<MyComponent {...props} />);

      // Assert
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      // Arrange
      const { container } = render(<MyComponent />);

      // Act & Assert
      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });
});
```

### Use Case / Service

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MyUseCase from './MyUseCase';

describe('MyUseCase', () => {
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
    };
  });

  describe('execute', () => {
    it('should execute successfully with valid input', async () => {
      // Arrange
      const input = { title: 'Test' };
      const expected = { id: '123', title: 'Test' };
      mockRepository.save.mockResolvedValue(expected);
      const useCase = new MyUseCase(mockRepository);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(expected);
      expect(mockRepository.save).toHaveBeenCalledWith(input);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error when input is invalid', async () => {
      // Arrange
      const invalidInput = { title: '' };
      const useCase = new MyUseCase(mockRepository);

      // Act & Assert
      await expect(useCase.execute(invalidInput)).rejects.toThrow('Title is required');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
```

## Exécuter les tests

```bash
npm test                    # Tous les tests
npm test -- MyComponent     # Test spécifique
npm test -- --coverage      # Avec couverture
```
