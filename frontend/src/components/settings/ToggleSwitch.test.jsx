import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ToggleSwitch from './ToggleSwitch.jsx';

describe('ToggleSwitch', () => {
  it('reports its state and asks to flip it on click', () => {
    const onChange = vi.fn();
    render(<ToggleSwitch label="Match alerts" checked onChange={onChange} />);
    const toggle = screen.getByRole('switch', { name: 'Match alerts' });
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
