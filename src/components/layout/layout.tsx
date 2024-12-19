import React from 'react';
import Navbar from '../navbar/navbar.tsx';
import Footer from '../footer/footer.tsx';
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
        <Footer />
      </div>
    );
    };
    
    export default Layout;