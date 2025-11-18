// src/store/useAuthStore.ts
import { create } from 'zustand'
import { auth } from '../firebaseConfig'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

type MyUser = {
    uid: string
    email: string | null
    name?: string | null
}

type AuthState = {
    user: MyUser | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    setUser: (user: MyUser | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    login: async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const firebaseUser = userCredential.user
        const user: MyUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
        }
        set({ user, loading: false })
    },

    register: async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const firebaseUser = userCredential.user
        const user: MyUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
        }
        set({ user, loading: false })
    },

    logout: async () => {
        await signOut(auth)
        set({ user: null })
    },

    setUser: (user) => set({ user, loading: false }),
}))

// 🔹 Підписка на зміни авторизації при завантаженні сторінки
onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
        const user: MyUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
        }
        useAuthStore.getState().setUser(user)
    } else {
        useAuthStore.getState().setUser(null)
    }
})
