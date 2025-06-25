import { Link } from "react-router-dom";
import logo from "../../assets/logo.webp";
import styles from "../../assets/styles/header.module.css"

export default function HeaderComponent() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.linkHeader}>
        <img
          src={logo}
          alt="Logo"
          className={styles.logoHeader}
        />
        <h1 className={styles.headerTitle}>PokeBattle</h1>
      </Link>
    </header>
  );
}
