import Icon from './Icon.jsx';
import InterestTag from './InterestTag.jsx';
import ProfilePhoto from './ProfilePhoto.jsx';
import styles from './ProfileCard.module.css';

const MAX_VISIBLE_TAGS = 3;

export default function ProfileCard({ profile, priority = false }) {
  const { name, age, city, college, bio, interests, photoUrl } = profile;

  return (
    <article className={styles.card}>
      <ProfilePhoto src={photoUrl} name={name} priority={priority} />
      <div className={styles.overlay}>
        <h2 className={styles.name}>
          {name} <span className={styles.age}>{age}</span>
        </h2>
        <p className={styles.place}>
          <Icon name="pin" size={16} />
          {city} · {college}
        </p>
        <p className={styles.bio}>{bio}</p>
        <ul className={styles.tags}>
          {interests.slice(0, MAX_VISIBLE_TAGS).map((interest) => (
            <InterestTag key={interest} label={interest} />
          ))}
        </ul>
      </div>
    </article>
  );
}
