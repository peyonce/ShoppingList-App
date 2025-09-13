import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { login } from '../redux/authSlice';
import styles from './Form.module.css';

const API_URL = 'http://localhost:5000/users';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill all fields.');
            return;
        }

        try {

            const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
            if (!res.ok) throw new Error('Failed to fetch users');

            const users = await res.json();

            if (users.length === 0) {
                setError('No user found with this email.');
                return;
            }

            const user = users[0];

            if (user.password !== password) {
                setError('Incorrect password.');
                return;
            }


            dispatch(login(user));


            navigate('/home');
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Check console for details.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Login</h2>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.btn}>Login</button>
                </form>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
                    Don't have an account? <a href="/register" style={{ color: '#ff9800' }}>Register here</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
