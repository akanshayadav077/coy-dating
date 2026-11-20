import styles from './InterestTag.module.css';

export default function InterestTag({ label }) {
  return <li className={styles.tag}>{label}</li>;
}
