import { useState } from 'react';
import Button from '../shared/Button.jsx';
import DemoNotice from '../shared/DemoNotice.jsx';
import { validatePhone } from '../../utils/phone.js';
import PhoneInput from './PhoneInput.jsx';
import styles from './Auth.module.css';

export default function PhoneStep({ countryCode, number, inviteCode, onCountryCodeChange, onNumberChange, onSubmit }) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const clearError = (field) => setErrors((current) => ({ ...current, [field]: null }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      phone: validatePhone(countryCode, number),
      terms: hasAcceptedTerms ? null : 'Accept the Terms and Privacy Policy to continue.',
    };
    setErrors(nextErrors);
    if (!nextErrors.phone && !nextErrors.terms) onSubmit();
  };

  return (
    <>
      <h1 className={styles.title}>What’s your number?</h1>
      <p className={styles.lead}>This is how your crushes find you. Enter any valid-looking number to try the demo.</p>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <PhoneInput
          countryCode={countryCode}
          number={number}
          onCountryCodeChange={(code) => {
            onCountryCodeChange(code);
            clearError('phone');
          }}
          onNumberChange={(value) => {
            onNumberChange(value);
            clearError('phone');
          }}
          error={errors.phone}
        />
        {inviteCode && <DemoNotice>You were invited with code {inviteCode.toUpperCase()}. Invites are not tracked in this demo.</DemoNotice>}
        <label className={styles.terms}>
          <input
            type="checkbox"
            checked={hasAcceptedTerms}
            onChange={(event) => {
              setHasAcceptedTerms(event.target.checked);
              clearError('terms');
            }}
          />
          <span>
            I’m 18 or older and agree to the <span className={styles.legal}>Terms</span> and{' '}
            <span className={styles.legal}>Privacy Policy</span>.
          </span>
        </label>
        {errors.terms && (
          <p className={styles.error} role="alert">
            {errors.terms}
          </p>
        )}
        <Button type="submit" fullWidth>
          Send code
        </Button>
        <DemoNotice>No text message is sent. On the next screen, use the demo code 123456.</DemoNotice>
      </form>
    </>
  );
}
