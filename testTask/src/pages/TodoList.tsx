import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CiEdit } from 'react-icons/ci'
import { db } from '../firebaseConfig'
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore'

type Todo = {
    id: string
    text: string
    completed: boolean
    userId: string
}

const TodoSchema = Yup.object().shape({
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
            const q = query(collection(db, 'todos'), where('userId', '==', user.uid))
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

    // 🔹 Додавання нового завдання
    const addTodo = async (text: string) => {
        if (!user) return
        const docRef = await addDoc(collection(db, 'todos'), {
            text,
            completed: false,
            userId: user.uid,
        })
        setTodos([...todos, { id: docRef.id, text, completed: false, userId: user.uid }])
    }

    // 🔹 Редагування завдання
    const updateTodo = async (id: string, text: string, completed?: boolean) => {
        const todoRef = doc(db, 'todos', id)
        const todo = todos.find((t) => t.id === id)
        if (!todo) return
        const updatedTodo = { ...todo, text, completed: completed ?? todo.completed }
        await updateDoc(todoRef, updatedTodo)
        setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)))
        setEditingId(null)
    }

    // 🔹 Видалення завдання
    const deleteTodo = async (id: string) => {
        const todoRef = doc(db, 'todos', id)
        await deleteDoc(todoRef)
        setTodos((prev) => prev.filter((t) => t.id !== id))
    }

    // 🔹 Зміна статусу completed
    const toggleCompleted = async (id: string) => {
        const todo = todos.find((t) => t.id === id)
        if (!todo) return
        await updateTodo(id, todo.text, !todo.completed)
    }

    return (
        <section className="h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-6 text-center">Todo List</h2>
         
                {/* 🔹 Додати нове завдання */}
                <Formik
                    initialValues={{ text: '' }}
                    validationSchema={TodoSchema}
                    onSubmit={async (values, { resetForm }) => {
                        await addTodo(values.text)
                        resetForm()
                    }}
                >
                    <Form className="space-y-4 flex flex-col">
                        <Field
                            name="text"
                            placeholder="Enter your task"
                            className="w-full border border-gray-300 p-2 rounded-xl"
                        />
                        <ErrorMessage
                            name="text"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-black hover:bg-black/70 text-white font-bold py-2 px-4 rounded-xl"
                        >
                            Add Task
                        </button>
                    </Form>
                </Formik>

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
                                    <Formik
                                        initialValues={{ text: todo.text }}
                                        validationSchema={TodoSchema}
                                        onSubmit={async (values) => updateTodo(todo.id, values.text, todo.completed)}
                                    >
                                        <Form className="flex flex-1 gap-2 items-center">
                                            <Field
                                                name="text"
                                                className="flex-1 border border-gray-300 p-2 rounded-xl"
                                            />
                                            <ErrorMessage
                                                name="text"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-xl"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-3 rounded-xl"
                                            >
                                                Cancel
                                            </button>
                                        </Form>
                                    </Formik>
                                ) : (
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleCompleted(todo.id)}
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
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-xl"
                                        >
                                            Delete
                                        </button>
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
