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
    <form onSubmit={handleSubmit} className="space-y-4  flex items-center justify-between mb-4 border border-[#cc70ea] text-[#cc70ea] p-4 mx-auto rounded-xl max-w-xl w-full ">
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Назва нового списку"
        className="w-full max-w-[70%]  p-2 m-0"
      />
      <button
        type="submit"
        className="bg-[#cc70ea]/20 transition hover:bg-[#cc70ea]/40 text-[#] font-bold py-2 px-4 rounded-xl"
        disabled={loading}
      >
        {loading ? "Додається..." : "Додати список"}
      </button>
    </form>
  );
}
