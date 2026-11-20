import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import OTPInput from './OTPInput.jsx';

function Harness() {
  const [value, setValue] = useState('');
  return <OTPInput value={value} onChange={setValue} />;
}

const boxes = () => screen.getAllByLabelText(/Digit \d of 6/);
const values = () => boxes().map((box) => box.value).join('');

describe('OTPInput', () => {
  it('renders six boxes and fills them as digits are typed', () => {
    render(<Harness />);
    expect(boxes()).toHaveLength(6);
    fireEvent.change(boxes()[0], { target: { value: '1' } });
    fireEvent.change(boxes()[1], { target: { value: '2' } });
    expect(values()).toBe('12');
  });

  it('ignores non-digits', () => {
    render(<Harness />);
    fireEvent.change(boxes()[0], { target: { value: 'a' } });
    expect(values()).toBe('');
  });

  it('fills every box from a pasted code', () => {
    render(<Harness />);
    fireEvent.paste(boxes()[0], { clipboardData: { getData: () => '12 34-56 99' } });
    expect(values()).toBe('123456');
  });

  it('deletes the previous digit on Backspace in an empty box', () => {
    render(<Harness />);
    fireEvent.paste(boxes()[0], { clipboardData: { getData: () => '123' } });
    fireEvent.keyDown(boxes()[3], { key: 'Backspace' });
    expect(values()).toBe('12');
  });
});
