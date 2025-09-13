import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.landingContainer}>
            <header className={styles.landingHeader}>
                <h1>Shopping List App</h1>
                <p>Your tools for tracking and organizing all your shopping lists.</p>
            </header>

            <div className={styles.landingActions}>
                <button className={styles.btn} onClick={() => navigate('/login')}>
                    Login
                </button>
                <button className={styles.btn} onClick={() => navigate('/register')}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
