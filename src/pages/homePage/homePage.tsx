import React from "react";
import { Link } from "react-router-dom";
import styles from "./homePage.module.css";
import BestSellers from "../../components/bestSellers/bestSellers.tsx";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>
        Catch the Best Deals Before They Swim Away!
      </h1>
      <div className={styles.content}>
        <p className={styles.description}>
          Dive into our products right now
          <Link to="/products" className={styles.seeMoreButton}>
            Our Products{" "}
          </Link>
        </p>
      </div>
      <BestSellers />
    </div>
  );
};

export default Home;
