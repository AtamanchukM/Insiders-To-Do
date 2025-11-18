import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface AddUsersProps {
  listId: string;
}

export default function AddUsers({ listId }: AddUsersProps) {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!uid.trim()) {
      setError("Введіть UID користувача");
      return;
    }
    setLoading(true);
    try {
      // Додаємо UID у масив sharedWith
      await updateDoc(doc(db, "todoLists", listId), {
        sharedWith: arrayUnion(uid.trim()),
      });
      setSuccess("Користувача додано до sharedWith!");
      setUid("");
    } catch (e) {
      setError((e as Error).message || "Помилка при додаванні користувача");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex text-white gap-2 mt-2">
      <input
        type="text"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        placeholder="UID співучасника"
        className="border p-2 rounded text-black"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-2"
        disabled={loading}
      >
        {loading ? "Додається..." : "Додати до sharedWith"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  );
}
