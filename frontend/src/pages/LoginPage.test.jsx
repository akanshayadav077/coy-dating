import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AccountContext } from '../context/AccountContext.jsx';
import LoginPage from './LoginPage.jsx';

function renderLogin(login = vi.fn().mockResolvedValue()) {
  render(
    <MemoryRouter>
      <AccountContext.Provider value={{ login }}>
        <LoginPage />
      </AccountContext.Provider>
    </MemoryRouter>,
  );
  return login;
}

const typeCode = (code) =>
  fireEvent.paste(screen.getByLabelText('Digit 1 of 6'), { clipboardData: { getData: () => code } });

function reachOtpStep() {
  fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '9876543210' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
}

describe('LoginPage', () => {
  it('validates the phone number and terms before sending the code', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    expect(screen.getByText('Enter your phone number.')).toBeTruthy();
    expect(screen.getByText(/Accept the Terms/)).toBeTruthy();
  });

  it('clears the errors once the user fixes the fields', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '9876543210' } });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('moves to the OTP step and never claims a text message was sent', () => {
    renderLogin();
    reachOtpStep();
    expect(screen.getByRole('heading', { name: 'Enter the code' })).toBeTruthy();
    expect(screen.getByText('Demo code for +91 98765 43210.')).toBeTruthy();
    expect(screen.getAllByText(/No text message is sent/).length).toBeGreaterThan(0);
  });

  it('rejects a wrong code with a clear message', () => {
    const login = renderLogin();
    reachOtpStep();
    typeCode('111111');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert').textContent).toMatch(/123456/);
    expect(login).not.toHaveBeenCalled();
  });

  it('logs in with the account phone when the demo code is correct', () => {
    const login = renderLogin();
    reachOtpStep();
    typeCode('123456');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(login).toHaveBeenCalledWith('+91 9876543210');
  });

  it('lets the user change the number and shows the resend countdown', () => {
    renderLogin();
    reachOtpStep();
    expect(screen.getByText(/New code in 30s/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Change number' }));
    expect(screen.getByRole('heading', { name: 'What’s your number?' })).toBeTruthy();
  });
});
