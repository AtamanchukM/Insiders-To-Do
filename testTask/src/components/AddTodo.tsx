import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthStore } from "../store/useAuthStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TodoSchema } from "../pages/TodoList";
import type { Todo } from "../pages/TodoList";

interface AddTodoProps {
  onAdd: (todo: Todo) => void;
  listId: string;
}

export default function AddTodo({ onAdd, listId }: AddTodoProps) {
  const { user } = useAuthStore((s) => s);

  const addTodo = async (text: string) => {
    if (!user) return;
    // Додаємо задачу у підколекцію конкретного списку
    const docRef = await addDoc(collection(db, "todoLists", listId, "todos"), {
      text,
      completed: false,
      userId: user.uid,
    });
    onAdd({ id: docRef.id, text, completed: false, userId: user.uid });
  };

  return (
    <Formik
      initialValues={{ text: "" }}
      validationSchema={TodoSchema}
      onSubmit={async (values, { resetForm }) => {
        await addTodo(values.text);
        resetForm();
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
  );
}
