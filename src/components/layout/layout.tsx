import React from 'react';
import Navbar from '../navbar/navbar.tsx';

import styles from './layout.module.css';

interface LayoutProps {
children: React.ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <div className={styles.app}>         
        <Navbar />
        <main className={styles.mainContent}> 
          {children}
        </main>      
      </div>
    );
    };
    
    export default Layout;