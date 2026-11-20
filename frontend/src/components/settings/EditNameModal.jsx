import { useState } from 'react';
import Button from '../shared/Button.jsx';
import Modal, { ModalActions } from '../shared/Modal.jsx';
import TextField from '../shared/TextField.jsx';
import { validateFirstName } from '../../utils/validation.js';

export default function EditNameModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateFirstName(name);
    if (validationError) return setError(validationError);

    setIsSaving(true);
    try {
      await onSave(name.trim());
      onClose();
    } catch (requestError) {
      setError(requestError.message);
      setIsSaving(false);
    }
  };

  return (
    <Modal title="Change first name" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="First name"
          hint="Your matches see this name."
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
        <ModalActions>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}
