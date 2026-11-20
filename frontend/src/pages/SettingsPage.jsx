import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddEmailModal from '../components/settings/AddEmailModal.jsx';
import ConfirmationModal from '../components/settings/ConfirmationModal.jsx';
import EditNameModal from '../components/settings/EditNameModal.jsx';
import InviteCard from '../components/settings/InviteCard.jsx';
import SettingsCard from '../components/settings/SettingsCard.jsx';
import SettingsRow from '../components/settings/SettingsRow.jsx';
import ToggleSwitch from '../components/settings/ToggleSwitch.jsx';
import Button from '../components/shared/Button.jsx';
import DemoNotice from '../components/shared/DemoNotice.jsx';
import Icon from '../components/shared/Icon.jsx';
import { useAccount } from '../hooks/useAccount.js';
import { api } from '../services/api.js';
import { maskPhone } from '../utils/phone.js';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { account, update, logout, remove } = useAccount();
  const [openDialog, setOpenDialog] = useState(null);
  const [alertsError, setAlertsError] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const closeDialog = () => setOpenDialog(null);
  const goBack = () => (location.key === 'default' ? navigate('/discover') : navigate(-1));

  const leaveAccount = async (action) => {
    await action();
    navigate('/', { replace: true });
  };

  const changeAlerts = async (alertsEnabled) => {
    setAlertsError(null);
    try {
      await update({ alertsEnabled });
    } catch (error) {
      setAlertsError(error.message);
    }
  };

  const resetDemo = async () => {
    await api.resetDemo();
    closeDialog();
    setResetMessage('Swipes, matches, and chats reset. Head back to Discover!');
  };

  return (
    <section className={styles.page}>
      <button type="button" className={styles.back} onClick={goBack}>
        <Icon name="back" size={18} />
        Back
      </button>
      <h1 className={styles.title}>Settings</h1>

      <SettingsCard heading="Your details">
        <SettingsRow
          title="First name"
          description={account.firstName}
          action={
            <Button variant="link" onClick={() => setOpenDialog('name')}>
              Change
            </Button>
          }
        />
        <SettingsRow title="Your number" description={maskPhone(account.phone)} />
        <SettingsRow
          title="Email"
          description={account.email ?? 'Add it so people who only have your email can find you.'}
          action={
            <Button variant="secondary" onClick={() => setOpenDialog('email')}>
              {account.email ? 'Change' : 'Add'}
            </Button>
          }
        />
      </SettingsCard>

      <SettingsCard heading="Preferences">
        <SettingsRow
          title="Alerts"
          description={alertsError ?? 'When it’s a match.'}
          action={<ToggleSwitch label="Match alerts" checked={account.alertsEnabled} onChange={changeAlerts} />}
        />
      </SettingsCard>

      <SettingsCard heading="Demo controls">
        <SettingsRow
          title="Reset swipes & matches"
          description={resetMessage ?? 'Clear swipes, matches, and chats so you can replay the 31-profile deck.'}
          action={
            <Button variant="secondary" onClick={() => setOpenDialog('reset')}>
              Reset demo
            </Button>
          }
        />
      </SettingsCard>

      <InviteCard referralCode={account.referralCode} />

      <div className={styles.accountActions}>
        <Button variant="secondary" onClick={() => leaveAccount(logout)}>
          Log out
        </Button>
        <Button variant="dangerLink" onClick={() => setOpenDialog('delete')}>
          Delete account
        </Button>
      </div>

      <DemoNotice>
        Your number, email and alert choice are saved only in this app’s local JSON file. Nothing is sent or verified.
      </DemoNotice>

      {openDialog === 'name' && <EditNameModal currentName={account.firstName} onSave={(firstName) => update({ firstName })} onClose={closeDialog} />}
      {openDialog === 'email' && <AddEmailModal currentEmail={account.email} onSave={(email) => update({ email })} onClose={closeDialog} />}
      {openDialog === 'reset' && (
        <ConfirmationModal
          title="Reset demo swipes & matches?"
          message="This clears all swipes, matches, and chat messages while keeping your demo account signed in."
          confirmLabel="Reset demo"
          onConfirm={resetDemo}
          onClose={closeDialog}
        />
      )}
      {openDialog === 'delete' && (
        <ConfirmationModal
          title="Delete your demo account?"
          message="This clears your name, email, swipes and matches so you can start over. The sample profiles are not affected."
          confirmLabel="Delete account"
          onConfirm={() => leaveAccount(remove)}
          onClose={closeDialog}
        />
      )}
    </section>
  );
}
