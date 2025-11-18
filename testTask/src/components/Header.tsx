import { useAuthStore } from "../store/useAuthStore";

export default function Header() {
  // const { user } = useAuthStore((s) => s)
  // const userName = (useAuthStore.getState().user)
  const { user, logout } = useAuthStore((s) => s);
  const name = user?.userName || "Guest";

  return (
    <header className="bg-[#cc70ea]/10 text-white p-4 flex justify-end items-center gap-8 mb-5">
      <h1 className="text-2xl font-bold">{name}</h1>
      <button
        onClick={logout}
        className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 "
      >
        Logout
      </button>
    </header>
  );
}
