import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      <h1 className={styles.navbarText}>
        Meme Generator
      </h1>
    </nav>
  );
};

export default Navbar;
