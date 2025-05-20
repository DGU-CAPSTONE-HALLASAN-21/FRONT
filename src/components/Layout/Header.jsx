import styles from './Layout.module.css';
import logo from '/public/logo.png'; // ✅ 실제 이미지 경로로 바꿔줘

function Header({ title }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  );
}

export default Header;
