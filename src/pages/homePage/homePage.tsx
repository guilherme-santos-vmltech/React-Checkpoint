import React from 'react';
import styles from './homePage.module.css';

const Home: React.FC = () => {
return (
  <div className={styles.home}>
    <h1 className={styles.title}>Welcome to Your App</h1>
    <p className={styles.description}>This is the home page of your application.</p>
  </div>
);
};

export default Home;