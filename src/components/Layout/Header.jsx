import styles from './Layout.module.css';

function Header({ title }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title} >{title}</h1>
      </div>
    </header>
  );
}

export default Header;
