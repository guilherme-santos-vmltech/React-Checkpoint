import React from 'react';
import styles from './loadingDots.module.css';

const LoadingDots: React.FC = () => {
return (
  <div 
    className={styles.loading} 
    role="status"
    aria-label="Loading content"
  >
    Loading
    <span className={styles.dot1} aria-hidden="true">.</span>
    <span className={styles.dot2} aria-hidden="true">.</span>
    <span className={styles.dot3} aria-hidden="true">.</span>
  </div>
);
};

export default LoadingDots;