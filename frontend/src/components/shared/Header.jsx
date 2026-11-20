import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils/classNames.js';
import Icon from './Icon.jsx';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.brand}>coy</span>
      <NavLink
        to="/settings"
        aria-label="Settings"
        className={({ isActive }) => classNames(styles.gear, isActive && styles.active)}
      >
        <Icon name="settings" size={22} />
      </NavLink>
    </header>
  );
}
