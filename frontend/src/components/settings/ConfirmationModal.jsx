import { useState } from 'react';
import Button from '../shared/Button.jsx';
import Modal, { ModalActions } from '../shared/Modal.jsx';

export default function ConfirmationModal({ title, message, confirmLabel, onConfirm, onClose }) {
  const [error, setError] = useState(null);
  const [isWorking, setIsWorking] = useState(false);

  const handleConfirm = async () => {
    setIsWorking(true);
    try {
      await onConfirm();
    } catch (requestError) {
      setError(requestError.message);
      setIsWorking(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <p>{message}</p>
      {error && <p role="alert">{error}</p>}
      <ModalActions>
        <Button variant="danger" onClick={handleConfirm} disabled={isWorking}>
          {isWorking ? 'Working…' : confirmLabel}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalActions>
    </Modal>
  );
}
