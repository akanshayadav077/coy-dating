import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils/classNames.js';
import Icon from './Icon.jsx';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/discover', label: 'Discover', icon: 'compass' },
  { to: '/matches', label: 'Matches', icon: 'heart' },
];

export default function Navbar({ matchCount }) {
  return (
    <nav className={styles.nav} aria-label="Main">
      <span className={styles.brand}>coy</span>
      <ul className={styles.links}>
        {LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end
              className={({ isActive }) => classNames(styles.link, isActive && styles.active)}
            >
              <Icon name={icon} size={22} />
              <span>{label}</span>
              {to === '/matches' && matchCount > 0 && (
                <span className={styles.badge} aria-label={`${matchCount} matches`}>
                  {matchCount}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
