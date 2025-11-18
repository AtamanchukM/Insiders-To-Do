import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

import AddTodo from '../components/AddTodo'
import ChangeTodo from '../components/ChangeTodo'
import RemoveTodo from '../components/RemoveTodo'


import * as Yup from 'yup'
import { CiEdit } from 'react-icons/ci'
import { db } from '../firebaseConfig'
import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore'



export type Todo = {
    id: string
    text: string
    completed: boolean
    userId: string
}

export const TodoSchema = Yup.object().shape({
    text: Yup.string().trim().required('Task cannot be empty')
})
export default function TodoList() {
    const { user, logout } = useAuthStore((s) => s)
    const [todos, setTodos] = useState<Todo[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

    // 🔹 Завантаження todos з Firestore
    useEffect(() => {
        if (!user) return

        const fetchTodos = async () => {
            const q = query(collection(db, 'insiders'), where('userId', '==', user.uid))
            const snapshot = await getDocs(q)
            const todosData: Todo[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                text: doc.data().text,
                completed: doc.data().completed,
                userId: doc.data().userId,
            }))
            setTodos(todosData)
        }

        fetchTodos()
    }, [user])


    // 🔹 Оновлення завдання після редагування
    const handleUpdated = (updatedTodo: Todo) => {
        setTodos((prev) => prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
        setEditingId(null);
    }

    // 🔹 Видалення завдання
    const handleRemoved = (id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }


    return (
        <section className="h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-6 text-center">Todo List</h2>
         
                {/* 🔹 Додати нове завдання */}
                <AddTodo onAdd={(todo) => setTodos((prev) => [...prev, todo])} />

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
                                        onUpdated={handleUpdated}
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            disabled
                                            className="mr-2"
                                        />
                                        <button
                                            onClick={() => setEditingId(todo.id)}
                                            className="mr-2"
                                        >
                                            <CiEdit />
                                        </button>
                                        <span
                                            className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
                                        >
                                            {todo.text}
                                        </span>
                                        <RemoveTodo id={todo.id} onRemoved={handleRemoved} />
                                    </>
                                )}
                            </li>
                        ))
                    )}
                </ul>

                <button
                    onClick={logout}
                    className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
                >
                    Logout
                </button>
            </div>
        </section>
    )
}
