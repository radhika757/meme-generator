/* eslint-disable react/prop-types */
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = ({ isAuthenticated }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.memeGenerator}>
      <nav className={styles.navbarContainer}>
        <span></span>
        <h1 className={styles.navbarText}>Meme Generator</h1>
        {isAuthenticated ? (
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <></>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
