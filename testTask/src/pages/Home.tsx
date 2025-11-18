import { useEffect, useState } from "react";
import AddNewTodoList from "../components/AddNewTodoList";
import RemoveTodoList from "../components/RemoveTodoList";
import TodoList from "./TodoList";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  where,
  query,
} from "firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";

type TodoListType = {
  id: string;
  title: string;
  userId: string;
};

export default function Home() {
  const { user } = useAuthStore((s) => s);
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchLists = async () => {
      const q = query(
        collection(db, "todoLists"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);
      setTodoLists(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as TodoListType))
      );
    };
    fetchLists();
  }, [user]);

  const handleAdd = async (title: string) => {
    if (!user) return;
    // Додаємо список з правильними полями
    const docRef = await addDoc(collection(db, "todoLists"), {
      title: title,
      userId: user.uid,
      createdAt: new Date(),
    });
    setTodoLists((prev) => [
      ...prev,
      { id: docRef.id, title, userId: user.uid },
    ]);
  };

  // Remove from state only, do not delete from Firestore here
  const handleRemove = (id: string) => {
    setTodoLists((prev) => prev.filter((l) => l.id !== id));
  };

  // Handler to update title in state after edit
  const handleTitleUpdate = (id: string, newTitle: string) => {
    setTodoLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, title: newTitle } : l))
    );
  };

  return (
    <div className="flex border justify-center flex-col max-w-7xl mx-auto p-4">
      <AddNewTodoList onAdd={handleAdd} />
      <ul className="flex flex-wrap justify-center  gap-4">
        {todoLists.map((list) => (
          <div key={list.id} className="mb-4">
            <div className="flex items-center gap-2 mb-2"></div>
            <TodoList
              listId={list.id}
              title={list.title}
              onTitleUpdate={(newTitle) => handleTitleUpdate(list.id, newTitle)}
              removeButton={
                <RemoveTodoList id={list.id} onRemoved={handleRemove} />
              }
            />
          </div>
        ))}
      </ul>
    </div>
  );
}
