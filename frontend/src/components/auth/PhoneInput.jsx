import { classNames } from '../../utils/classNames.js';
import CountryCodeSelector from './CountryCodeSelector.jsx';
import styles from './PhoneInput.module.css';

const MAX_DIGITS = 12;

export default function PhoneInput({ countryCode, number, onCountryCodeChange, onNumberChange, error }) {
  return (
    <div>
      <div className={classNames(styles.field, error && styles.invalid)}>
        <CountryCodeSelector value={countryCode} onChange={onCountryCodeChange} />
        <input
          className={styles.input}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="98765 43210"
          aria-label="Phone number"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'phone-error' : undefined}
          maxLength={MAX_DIGITS}
          value={number}
          onChange={(event) => onNumberChange(event.target.value.replace(/\D/g, ''))}
          autoFocus
        />
      </div>
      {error && (
        <p id="phone-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
