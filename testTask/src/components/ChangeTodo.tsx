import { Formik, Form, Field, ErrorMessage } from "formik";
import { TodoSchema } from "./TodoList";
import type { Todo } from "./TodoList";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface ChangeTodoProps {
  todo: Todo;
  listId: string;
  onUpdated: (todo: Todo) => void;
  onCancel: () => void;
}

export default function ChangeTodo({
  todo,
  listId,
  onUpdated,
  onCancel,
}: ChangeTodoProps) {
  const handleSubmit = async (values: { text: string; description: string; completed: boolean }) => {
    // Оновлюємо задачу у підколекції конкретного списку
    const todoRef = doc(db, "todoLists", listId, "todos", todo.id);
    const updatedTodo = {
      ...todo,
      text: values.text,
      description: values.description,
      completed: values.completed,
    };
    await updateDoc(todoRef, updatedTodo);
    onUpdated(updatedTodo);
  };
  return (
    <Formik
      initialValues={{ text: todo.text, description: todo.description || "", completed: todo.completed }}
      validationSchema={TodoSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-1 gap-2 items-center">
          <div className="flex-1 flex flex-col gap-1">
            <Field
              name="text"
              className="border border-gray-300 p-2 rounded-xl mb-1"
              placeholder="Task title"
            />
            <ErrorMessage
              name="text"
              component="div"
              className="text-red-500 text-sm"
            />
            <Field
              name="description"
              as="textarea"
              className="border border-gray-300 p-2 rounded-xl text-sm min-h-[40px]"
              placeholder="Опис (необов'язково)"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-xl"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-3 rounded-xl"
          >
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}
