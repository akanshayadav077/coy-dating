import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProfilePhoto from './ProfilePhoto.jsx';

describe('ProfilePhoto', () => {
  it('renders the photo with descriptive alt text', () => {
    render(<ProfilePhoto src="https://example.com/maya.jpg" name="Maya Rao" />);
    expect(screen.getByAltText('Photo of Maya Rao')).toBeTruthy();
  });

  it('falls back to initials when the image fails to load', () => {
    render(<ProfilePhoto src="https://example.com/broken.jpg" name="Maya Rao" />);
    fireEvent.error(screen.getByAltText('Photo of Maya Rao'));
    expect(screen.getByText('MR')).toBeTruthy();
  });
});
