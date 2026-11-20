import { useState } from 'react';
import Button from '../shared/Button.jsx';
import DemoNotice from '../shared/DemoNotice.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import { DEMO_OTP, OTP_LENGTH, RESEND_SECONDS, isOtpCorrect } from '../../services/demoAuth.js';
import OTPInput from './OTPInput.jsx';
import styles from './Auth.module.css';

export default function OtpStep({ phoneLabel, onVerified, onChangeNumber }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { secondsLeft, restart } = useCountdown(RESEND_SECONDS);

  const handleChange = (nextCode) => {
    setCode(nextCode);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (code.length < OTP_LENGTH) return setError(`Enter all ${OTP_LENGTH} digits.`);
    if (!isOtpCorrect(code)) {
      setCode('');
      return setError(`That code isn’t right. In this demo the code is ${DEMO_OTP}.`);
    }
    setIsSubmitting(true);
    try {
      await onVerified();
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    restart();
    setCode('');
    setNotice(`Demo mode: no text message was sent. The code is still ${DEMO_OTP}.`);
  };

  return (
    <>
      <h1 className={styles.title}>Enter the code</h1>
      <p className={styles.lead}>Demo code for {phoneLabel}.</p>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <OTPInput value={code} onChange={handleChange} hasError={Boolean(error)} />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Continue'}
        </Button>
        <div className={styles.secondaryActions}>
          {secondsLeft > 0 ? (
            <span aria-live="polite">New code in {secondsLeft}s</span>
          ) : (
            <Button variant="link" onClick={handleResend}>
              Resend code
            </Button>
          )}
          <Button variant="link" onClick={onChangeNumber}>
            Change number
          </Button>
        </div>
        {notice && <p className={styles.notice}>{notice}</p>}
        <DemoNotice>No text message is sent. Use {DEMO_OTP} to continue.</DemoNotice>
      </form>
    </>
  );
}
