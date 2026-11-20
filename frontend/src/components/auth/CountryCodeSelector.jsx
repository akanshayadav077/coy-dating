import { COUNTRIES } from '../../utils/countries.js';
import styles from './CountryCodeSelector.module.css';

export default function CountryCodeSelector({ value, onChange }) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Country code"
    >
      {COUNTRIES.map(({ code, label, name }) => (
        <option key={code} value={code} title={name}>
          {code} · {label}
        </option>
      ))}
    </select>
  );
}
