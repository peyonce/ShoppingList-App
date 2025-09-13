import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { setItems, addItem, updateItem, deleteItem } from "../redux/shoppingListSlice";

interface ShoppingItem {
  id: number;
  name: string;
}

const API_URL = "http://localhost:5000/shoppingLists";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const items = useSelector((state: RootState) => state.shoppingList.items);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");


  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => dispatch(setItems(data)))
      .catch((err) => console.error("Error fetching items:", err));
  }, [dispatch]);


  const handleAdd = () => {
    if (!newItem.trim()) return;

    const item = { name: newItem };
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then((data: ShoppingItem) => dispatch(addItem(data)))
      .catch((err) => console.error(err));

    setNewItem("");
  };


  const handleUpdate = (id: number) => {
    if (!editValue.trim()) return;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editValue }),
    })
      .then((res) => res.json())
      .then(() => {
        dispatch(updateItem({ id, name: editValue }));
        setEditingId(null);
        setEditValue("");
      })
      .catch((err) => console.error(err));
  };


  const handleDelete = (id: number) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => dispatch(deleteItem(id)))
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1>My Shopping Lists</h1>
        <p>Manage, track, and organize your shopping in one place.</p>
      </header>

      <div className={styles.inputGroup}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
        />
        <button onClick={handleAdd} className={styles.btn}>Add</button>
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
                />
                <button onClick={() => handleUpdate(item.id)} className={styles.btn}>Save</button>
                <button onClick={() => setEditingId(null)} className={styles.btn}>Cancel</button>
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
                >
                  save
                </button>
                <button onClick={() => handleDelete(item.id)} className={styles.btn}>delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
