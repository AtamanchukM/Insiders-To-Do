import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

import AddTodo from "../components/AddTodo";
import ChangeTodo from "../components/ChangeTodo";
import RemoveTodo from "../components/RemoveTodo";
import RemoveTodoList from "../components/RemoveTodoList";

import * as Yup from "yup";
import { CiEdit } from "react-icons/ci";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
};

export const TodoSchema = Yup.object().shape({
  text: Yup.string().trim().required("Task cannot be empty"),
  completed: Yup.boolean(),
});

interface TodoListProps {
  listId: string;
  title: string;
  onTitleUpdate?: (newTitle: string) => void;
  removeButton?: React.ReactNode;
}

export default function TodoList({
  listId,
  title,
  onTitleUpdate,
  removeButton,
}: TodoListProps) {
  const { user } = useAuthStore((s) => s);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [titleLoading, setTitleLoading] = useState(false);

  // 🔹 Завантаження todos з Firestore
  useEffect(() => {
    if (!user || !listId) return;
    const fetchTodos = async () => {
      // Підколекція задач для конкретного списку
      const todosCol = collection(db, "todoLists", listId, "todos");
      const q = query(todosCol, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const todosData: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        completed: doc.data().completed,
        userId: doc.data().userId,
      }));
      setTodos(todosData);
    };
    fetchTodos();
  }, [user, listId]);

  // 🔹 Оновлення завдання після редагування
  const handleUpdated = (updatedTodo: Todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
    setEditingId(null);
  };

  // 🔹 Видалення завдання
  const handleRemoved = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleCompleted = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    // Оновлюємо задачу у підколекції конкретного списку
    await updateDoc(doc(db, "todoLists", listId, "todos", id), {
      completed: !todo.completed,
    });
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Handle title edit save
  const handleTitleSave = async () => {
    if (!titleInput.trim() || titleInput === title) {
      setIsEditingTitle(false);
      setTitleInput(title);
      return;
    }
    setTitleLoading(true);
    try {
      await updateDoc(doc(db, "todoLists", listId), {
        title: titleInput.trim(),
      });
      if (onTitleUpdate) onTitleUpdate(titleInput.trim());
      setIsEditingTitle(false);
    } catch {
      alert("Failed to update title");
    } finally {
      setTitleLoading(false);
    }
  };

  // Keep local input in sync if parent title changes
  useEffect(() => {
    setTitleInput(title);
  }, [title]);

  return (
    <section className=" flex items-center  bg-gray-100 text-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col justify-center">
        <div className="flex items-center justify-center mb-6 gap-2">
          {isEditingTitle ? (
            <>
              <input
                className="text-2xl font-bold border rounded px-2 py-1 w-2/3 text-center"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                disabled={titleLoading}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setIsEditingTitle(false);
                    setTitleInput(title);
                  }
                }}
              />
              <button
                className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                onClick={handleTitleSave}
                disabled={titleLoading}
              >
                {titleLoading ? "..." : "Save"}
              </button>
              <button
                className="ml-1 px-2 py-1 bg-gray-300 rounded"
                onClick={() => {
                  setIsEditingTitle(false);
                  setTitleInput(title);
                }}
                disabled={titleLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center">{title}</h2>
              <button
                className="ml-2 text-xl text-blue-500 hover:text-blue-700"
                onClick={() => setIsEditingTitle(true)}
                title="Edit list title"
              >
                <CiEdit />
              </button>
              {removeButton && <span className="ml-2">{removeButton}</span>}
            </>
          )}
        </div>
        {/* 🔹 Додати нове завдання */}
        <AddTodo
          listId={listId}
          onAdd={(todo) => setTodos((prev) => [...prev, todo])}
        />

        {/* 🔹 Список завдань */}
        <ul className="mt-6 space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">No tasks yet</p>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="p-4 border border-gray-300 rounded-xl flex justify-between items-center gap-2"
              >
                {editingId === todo.id ? (
                  <ChangeTodo
                    todo={todo}
                    listId={listId}
                    onUpdated={handleUpdated}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        toggleCompleted(todo.id);
                      }}
                      className="mr-2"
                    />
                    <button
                      onClick={() => setEditingId(todo.id)}
                      className="mr-2"
                    >
                      <CiEdit />
                    </button>
                    <span
                      className={`flex-1 ${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    <RemoveTodo
                      id={todo.id}
                      listId={listId}
                      onRemoved={handleRemoved}
                    />
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
