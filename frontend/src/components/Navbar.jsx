import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.memeGenerator}>
      <nav className={styles.navbarContainer}>
        <h1 className={styles.navbarText}>Meme Generator</h1>
      </nav>
    </div>
  );
};

export default Navbar;
