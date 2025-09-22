import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';

const API_URL = 'http://localhost:5000/users';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill all fields.');
            return;
        }

        try {

            const checkRes = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
            if (!checkRes.ok) throw new Error('Failed to check existing users');

            const existingUsers = await checkRes.json();
            if (existingUsers.length > 0) {
                setError('User with this email already exists.');
                return;
            }


            const registerRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!registerRes.ok) throw new Error('Failed to register user');

            const newUser = await registerRes.json();
            console.log('Registered user:', newUser);

            alert('Registration successful!');
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError('Something went wrong. Check console for details.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Register</h2>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
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
                    <button type="submit" className={styles.btn}>Register</button>
                </form>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
                    Already have an account? <a href="/login" style={{ color: '#ff9800' }}>Login here</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;