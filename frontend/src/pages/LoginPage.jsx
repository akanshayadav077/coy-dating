import { useState } from 'react';
import { useMatch } from 'react-router-dom';
import AuthLayout from '../components/shared/AuthLayout.jsx';
import OtpStep from '../components/auth/OtpStep.jsx';
import PhoneStep from '../components/auth/PhoneStep.jsx';
import { useAccount } from '../hooks/useAccount.js';
import { DEFAULT_COUNTRY_CODE } from '../utils/countries.js';
import { formatPhone, toAccountPhone } from '../utils/phone.js';

export default function LoginPage() {
  const { login } = useAccount();
  const invite = useMatch('/i/:code');
  const [step, setStep] = useState('phone');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [number, setNumber] = useState('');

  return (
    <AuthLayout onBack={step === 'otp' ? () => setStep('phone') : undefined}>
      {step === 'phone' ? (
        <PhoneStep
          countryCode={countryCode}
          number={number}
          inviteCode={invite?.params.code}
          onCountryCodeChange={setCountryCode}
          onNumberChange={setNumber}
          onSubmit={() => setStep('otp')}
        />
      ) : (
        <OtpStep
          phoneLabel={formatPhone(countryCode, number)}
          onVerified={() => login(toAccountPhone(countryCode, number))}
          onChangeNumber={() => setStep('phone')}
        />
      )}
    </AuthLayout>
  );
}
