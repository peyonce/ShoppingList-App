import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Form.module.css";

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                <button className={styles.btn} onClick={() => navigate("/")}>
                    Go to Landing Page
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
