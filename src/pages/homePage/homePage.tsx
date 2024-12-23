import React from "react";
import { Link } from "react-router-dom";
import styles from "./homePage.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>
        Catch the Best Deals Before They Swim Away!
      </h1>
      <p className={styles.description}>
        Dive into our products right now
        <Link to="/products" className={styles.seeMoreButton}>
          Our Products{" "}
        </Link>
      </p>
    </div>
  );
};

export default Home;
