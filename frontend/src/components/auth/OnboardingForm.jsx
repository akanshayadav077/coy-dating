import { useState } from 'react';
import Button from '../shared/Button.jsx';
import TextField from '../shared/TextField.jsx';
import { validateFirstName } from '../../utils/validation.js';
import styles from './Auth.module.css';

export default function OnboardingForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateFirstName(name);
    if (validationError) return setError(validationError);

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <TextField
        label="First name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setError(null);
        }}
        error={error}
        autoComplete="given-name"
        maxLength={30}
        autoFocus
      />
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  );
}
