import styles from './Layout.module.css';

function Footer({ message }) {
    return (
        <footer className={styles.footer}>
            <span>{message}</span>
        </footer>
    );
}

export default Footer;
