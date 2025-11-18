import { useState } from "react";

export default function AddNewTodoList({
  onAdd,
}: {
  onAdd: (title: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim());
    setTitle("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4  flex items-center justify-between mb-4 border p-4 mx-auto rounded-xl max-w-xl w-full">
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Назва нового списку"
        className="w-full max-w-[200px]  p-2 m-0"
      />
      <button
        type="submit"
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4"
        disabled={loading}
      >
        {loading ? "Додається..." : "Додати список"}
      </button>
    </form>
  );
}
