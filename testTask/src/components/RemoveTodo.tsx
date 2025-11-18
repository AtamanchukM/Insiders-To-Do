import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CiTrash } from "react-icons/ci";


interface RemoveTodoProps {
  id: string;
  listId: string;
  onRemoved: (id: string) => void;
}

export default function RemoveTodo({ id, listId, onRemoved }: RemoveTodoProps) {
  const handleRemove = async () => {
    await deleteDoc(doc(db, "todoLists", listId, "todos", id));
    onRemoved(id);
  };
  return (
    <button
      onClick={handleRemove}
      className=" hover:text-red-500 text-gray-700 font-bold py-1 p-1 transition-colors "
    >
        <CiTrash size={20} />
    </button>
  );
}
