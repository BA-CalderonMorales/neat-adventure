import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Button from './Button.svelte';

describe('Button', () => {
	it('should render with default text', () => {
		render(Button, { props: { children: 'Click me' } });
		
		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('should apply variant styles', () => {
		render(Button, { props: { variant: 'destructive', children: 'Delete' } });
		
		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-destructive');
	});

	it('should be disabled when disabled prop is true', () => {
		render(Button, { props: { disabled: true, children: 'Disabled' } });
		
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});
});