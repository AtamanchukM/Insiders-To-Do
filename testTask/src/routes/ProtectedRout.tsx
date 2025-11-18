import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

type Props = { children: ReactNode }

export default function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuthStore((s) => s)

    if (loading) return <p>Loading...</p> // показуємо лоадер поки Firebase перевіряє юзера
    if (!user) return <Navigate to="/login" replace />

    return <>{children}</>
}
