import { Link } from "react-router-dom";
import styles from "../../assets/styles/header.module.css"

export default function HeaderComponent() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.linkHeader}>
        <h1 className={styles.headerTitle}>PokeBattle</h1>
      </Link>
    </header>
  );
}
