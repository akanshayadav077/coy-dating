import AuthLayout from '../components/shared/AuthLayout.jsx';
import OnboardingForm from '../components/auth/OnboardingForm.jsx';
import { useAccount } from '../hooks/useAccount.js';
import styles from '../components/auth/Auth.module.css';

export default function OnboardingPage() {
  const { update } = useAccount();

  return (
    <AuthLayout>
      <h1 className={styles.title}>What’s your first name?</h1>
      <p className={styles.lead}>
        Your matches see it. It’s never shown to anyone unless you both like each other.
      </p>
      <OnboardingForm onSubmit={(firstName) => update({ firstName })} />
    </AuthLayout>
  );
}
