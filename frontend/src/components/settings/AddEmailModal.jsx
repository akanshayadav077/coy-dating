import { useState } from 'react';
import Button from '../shared/Button.jsx';
import DemoNotice from '../shared/DemoNotice.jsx';
import Modal, { ModalActions } from '../shared/Modal.jsx';
import TextField from '../shared/TextField.jsx';
import { validateEmail } from '../../utils/validation.js';

export default function AddEmailModal({ currentEmail, onSave, onClose }) {
  const [email, setEmail] = useState(currentEmail ?? '');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) return setError(validationError);

    setIsSaving(true);
    try {
      await onSave(email.trim());
      onClose();
    } catch (requestError) {
      setError(requestError.message);
      setIsSaving(false);
    }
  };

  return (
    <Modal title={currentEmail ? 'Change email' : 'Add your email'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          type="email"
          hint="So people who only have your email can find you."
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          error={error}
          autoComplete="email"
          autoFocus
        />
        <ModalActions>
          <DemoNotice>No verification email is sent. The address is stored but never confirmed.</DemoNotice>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save email'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}
