import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { setUser } from "../redux/authSlice";
import styles from "./Form.module.css";

const API_URL = "http://localhost:5000/users";

const ProfilePage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState(user?.password || "");
    const [message, setMessage] = useState("");

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>No user logged in</h2>
                    <p>Please login to see your profile.</p>
                </div>
            </div>
        );
    }

    const handleUpdate = async () => {
        if (!name.trim() || !password.trim()) {
            setMessage("Name and password cannot be empty.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password }),
            });

            if (!res.ok) throw new Error("Failed to update user");

            const updatedUser = { ...user, name, password };
            dispatch(setUser(updatedUser));
            setMessage("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error("Update error:", err);
            setMessage("Something went wrong. Try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>User Profile</h2>

                {message && <p className={styles.message}>{message}</p>}

                {isEditing ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                        className={styles.form}
                    >
                        <input
                            type="text"
                            value={name}
                            placeholder="Full Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className={styles.btn}>
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className={styles.btn}
                            style={{ background: "#555" }}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div>
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <button onClick={() => setIsEditing(true)} className={styles.btn}>
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
