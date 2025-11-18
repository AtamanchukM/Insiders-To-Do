import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface RemoveTodoProps {
    id: string;
    onRemoved: (id: string) => void;
}

export default function RemoveTodo({ id, onRemoved }: RemoveTodoProps) {
    const handleRemove = async () => {
        await deleteDoc(doc(db, 'insiders', id));
        onRemoved(id);
    };
    return (
        <button
            onClick={handleRemove}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-xl"
        >
            Delete
        </button>
    );
}
