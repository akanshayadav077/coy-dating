import Button from '../shared/Button.jsx';
import DemoNotice from '../shared/DemoNotice.jsx';
import Icon from '../shared/Icon.jsx';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.js';
import { buildInviteLink } from '../../utils/invite.js';
import styles from './InviteCard.module.css';

const COPY_LABELS = { idle: 'Copy link', copied: 'Copied!', failed: 'Copy failed' };

export default function InviteCard({ referralCode }) {
  const { status, copy } = useCopyToClipboard();
  const link = buildInviteLink(referralCode);
  const canShare = typeof navigator.share === 'function';

  const share = () =>
    navigator.share({ title: 'Join me on Coy', text: 'Find out if your crush likes you back.', url: link }).catch(() => {});

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Invite friends</h2>
      <p className={styles.text}>So your crush can join too.</p>
      <div className={styles.codeBox}>
        <span className={styles.label}>Your referral code</span>
        <span className={styles.code}>{referralCode}</span>
        <span className={styles.link}>{link}</span>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => copy(link)}>
            <Icon name="link" size={18} />
            {COPY_LABELS[status]}
          </Button>
          {canShare && (
            <Button onClick={share}>
              <Icon name="share" size={18} />
              Share link
            </Button>
          )}
        </div>
      </div>
      <DemoNotice>Referral codes are generated for show. Nothing is tracked or rewarded.</DemoNotice>
    </section>
  );
}
