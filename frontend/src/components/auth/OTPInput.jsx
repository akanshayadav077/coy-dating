import { useRef } from 'react';
import { OTP_LENGTH } from '../../services/demoAuth.js';
import { classNames } from '../../utils/classNames.js';
import styles from './OTPInput.module.css';

export default function OTPInput({ value, onChange, hasError = false, length = OTP_LENGTH }) {
  const inputs = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  const focusBox = (index) => inputs.current[Math.min(Math.max(index, 0), length - 1)]?.focus();

  const handleChange = (index, event) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const position = Math.min(index, value.length);
    onChange((value.slice(0, position) + digit + value.slice(position + 1)).slice(0, length));
    focusBox(position + 1);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const position = digits[index] ? index : index - 1;
      onChange(value.slice(0, Math.max(position, 0)));
      focusBox(position);
    }
    if (event.key === 'ArrowLeft') focusBox(index - 1);
    if (event.key === 'ArrowRight') focusBox(index + 1);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    focusBox(pasted.length);
  };

  return (
    <div className={styles.group} role="group" aria-label={`${length}-digit code`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          className={classNames(styles.box, hasError && styles.invalid)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={hasError}
          value={digit}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}
