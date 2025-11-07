import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies correct classes', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
    });
  });

  describe('CardHeader', () => {
    it('renders children correctly', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('applies correct spacing', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild;
      expect(header).toHaveClass('p-6');
    });
  });

  describe('CardTitle', () => {
    it('renders as h3 element', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const title = container.querySelector('h3');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title');
    });

    it('applies title styles', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('font-semibold');
    });
  });

  describe('CardDescription', () => {
    it('renders children correctly', () => {
      render(<CardDescription>Description text</CardDescription>);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('applies muted text color', () => {
      const { container } = render(<CardDescription>Desc</CardDescription>);
      const desc = container.firstChild;
      expect(desc).toHaveClass('text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('renders children correctly', () => {
      render(<CardContent>Content area</CardContent>);
      expect(screen.getByText('Content area')).toBeInTheDocument();
    });

    it('applies padding', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild;
      expect(content).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('renders children correctly', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('applies flex layout', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild;
      expect(footer).toHaveClass('flex', 'items-center');
    });
  });

  describe('Complete Card', () => {
    it('renders all card parts together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Challenge Card</CardTitle>
            <CardDescription>A sample challenge</CardDescription>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      );

      expect(screen.getByText('Challenge Card')).toBeInTheDocument();
      expect(screen.getByText('A sample challenge')).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });
  });
});
