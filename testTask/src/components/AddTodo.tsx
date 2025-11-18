import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthStore } from "../store/useAuthStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TodoSchema } from "./TodoList";
import type { Todo } from "./TodoList";

interface AddTodoProps {
  onAdd: (todo: Todo) => void;
  listId: string;
}

export default function AddTodo({ onAdd, listId }: AddTodoProps) {
  const { user } = useAuthStore((s) => s);

  const addTodo = async (text: string, description: string) => {
    if (!user) return;
    // Додаємо задачу у підколекцію конкретного списку
    const docRef = await addDoc(collection(db, "todoLists", listId, "todos"), {
      text,
      description,
      completed: false,
      userId: user.uid,
    });
    onAdd({ id: docRef.id, text, description, completed: false, userId: user.uid });
  };

  return (
    <Formik
      initialValues={{ text: "", description: "" }}
      validationSchema={TodoSchema}
      onSubmit={async (values, { resetForm }) => {
        await addTodo(values.text, values.description);
        resetForm(); // очищає і text, і description
      }}
    >
      <Form className="space-y-4 flex flex-col">
        <Field
          name="text"
          placeholder="Enter your task"
          className="w-full border border-[#cc70ea] p-2 rounded-xl "
        />
        <ErrorMessage
          name="text"
          component="div"
          className="text-red-500 text-sm"
        />
        <Field
          name="description"
          as="textarea"
          placeholder="Опис (необов'язково)"
          className="w-full border border--300 p-2 rounded-xl text-sm min-h-[60px]"
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-red-500 text-sm"
        />
        <button
          type="submit"
          className="bg-[#cc70ea]/20 hover:bg-[#cc70ea]/40 transition cursor-pointer text-[#d8ade7] font-bold py-2 px-4 rounded-xl"
        >
          Add Task
        </button>
      </Form>
    </Formik>
  );
}
