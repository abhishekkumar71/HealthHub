import React from "react";
import styles from "../styles/pages.module.css";
export default function Footer() {
  return (
    <>
      <footer className={styles.Footer}>
        <h5>&copy; All rights reserved</h5>
        <div className={styles.iconContainer}>
          <a
            href="https://www.linkedin.com/in/abhishek-kumar5471/"
            className={styles.icons}
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://github.com/abhishekkumar71" className={styles.icons}>
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://www.blogger.com/profile/11390721205359469828"
            className={styles.icons}
          >
            <i className="fa-brands fa-blogger"></i>
          </a>
        </div>
    
      </footer>
    </>
  );
}
