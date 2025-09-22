import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import type { RootState, AppDispatch } from "../redux/store";
import { setItems, addItem, updateItem, deleteItem } from "../redux/shoppingListSlice";
import { logout } from "../redux/authSlice";

interface ShoppingItem {
  id: number;
  name: string;
}

const API_URL = "http://localhost:5000/shoppingLists";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.shoppingList.items);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch shopping list items when the component mounts
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => dispatch(setItems(data)))
      .catch(() => setErrorMessage("Error fetching items."));
  }, [dispatch]);

  const handleFetchError = (err: any) => {
    setErrorMessage("An error occurred. Please try again.");
    console.error(err);
  };

  // Add a new item to the shopping list
  const handleAdd = () => {
    if (!newItem.trim()) return;

    const item = { name: newItem };
    
    // Check if item already exists in the list
    if (items.some((i) => i.name.toLowerCase() === newItem.toLowerCase())) {
      setErrorMessage("Item already exists.");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then((data: ShoppingItem) => {
        dispatch(addItem(data));
        setNewItem("");
      })
      .catch(handleFetchError);
  };

  // Update an existing item
  const handleUpdate = (id: number) => {
    if (!editValue.trim()) return;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editValue }),
    })
      .then(() => {
        dispatch(updateItem({ id, name: editValue }));
        setEditingId(null);
        setEditValue("");
      })
      .catch(handleFetchError);
  };

  // Delete an item from the shopping list
  const handleDelete = (id: number) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => dispatch(deleteItem(id)))
      .catch(handleFetchError);
  };

  // Navigate to the profile page
  const goToProfile = () => navigate("/profile");

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1>My Shopping Lists</h1>
        <p>Manage, track, and organize your shopping in one place.</p>
        <div className={styles.navButtons}>
          <button className={styles.btn} onClick={goToProfile} aria-label="Go to profile">
            Profile
          </button>
          <button className={styles.btn} onClick={handleLogout} aria-label="Logout">
            Logout
          </button>
        </div>
      </header>

      {/* Display error message if there is any */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.inputGroup}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
          aria-label="Enter item name"
        />
        <button onClick={handleAdd} className={styles.btn} aria-label="Add item">
          Add
        </button>
      </div>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  aria-label="Edit item name"
                />
                <button onClick={() => handleUpdate(item.id)} className={styles.btn} aria-label="Save item">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className={styles.btn} aria-label="Cancel edit">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setEditValue(item.name);
                  }}
                  className={styles.btn}
                  aria-label="Edit item"
                >
                  Update
                </button>
                <button onClick={() => handleDelete(item.id)} className={styles.btn} aria-label="Delete item">
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
