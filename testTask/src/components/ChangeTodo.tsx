import { Formik, Form, Field, ErrorMessage } from "formik";
import { TodoSchema } from "../pages/TodoList";
import type { Todo } from "../pages/TodoList";
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
  const handleSubmit = async (values: { text: string; completed: boolean }) => {
    // Оновлюємо задачу у підколекції конкретного списку
    const todoRef = doc(db, "todoLists", listId, "todos", todo.id);
    const updatedTodo = {
      ...todo,
      text: values.text,
      completed: values.completed,
    };
    await updateDoc(todoRef, updatedTodo);
    onUpdated(updatedTodo);
  };
  return (
    <Formik
      initialValues={{ text: todo.text, completed: todo.completed }}
      validationSchema={TodoSchema}
      onSubmit={handleSubmit}
    >
      {() => (
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
