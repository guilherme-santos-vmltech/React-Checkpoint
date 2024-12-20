import React from 'react';
import styles from './loadingDots.module.css';

const LoadingDots: React.FC = () => {
return (
  <div className={styles.loading}>
    Loading
    <span className={styles.dot1}>.</span>
    <span className={styles.dot2}>.</span>
    <span className={styles.dot3}>.</span>
  </div>
);
};

export default LoadingDots;