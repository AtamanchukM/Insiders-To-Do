import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface RemoveTodoListProps {
  id: string;
  onRemoved: (id: string) => void;
}

export default function RemoveTodoList({ id, onRemoved }: RemoveTodoListProps) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    await deleteDoc(doc(db, "todoLists", id));
    onRemoved(id); // Оновлює список у батьківському компоненті
    setLoading(false);
  };
  return (
    <button
      onClick={handleRemove}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-xl"
      disabled={loading}
    >
      {loading ? "Видаляється..." : "Видалити список"}
    </button>
  );
}
