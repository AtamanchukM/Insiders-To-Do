import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'


const LoginSchema = Yup.object().shape({
    // name: Yup.string()
    //     .min(2, 'Мінімум 2 символи')
    //     .required('Ім’я обов’язкове'),
    email: Yup.string()
        .email('Невірний email')
        .required('Email обов’язковий'),
    password: Yup.string()
        .min(6, 'Мінімум 6 символів')
        .required('Пароль обов’язковий'),
})


export default function Login() {
    const navigate = useNavigate()

    return (
        <section className="h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            // 🔥 Авторизація через Firebase
                            const userCredential = await signInWithEmailAndPassword(
                                auth,
                                values.email,
                                values.password
                            )

                            navigate('/todo')
                        } catch (err: any) {
                            console.error('Login error:', err)
                            setErrors({ email: 'Невірний email або пароль' })
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 flex flex-col">

                             {/* <label className="block text-sm font-medium mb-1" htmlFor="name">
                                Name
                            </label>
                            <Field
                                type="name"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                className="w-full border border-gray-300 p-2 rounded-xl"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            /> */}

                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 p-2 rounded-xl"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />

                            

                            <label className="block text-sm font-medium mb-1" htmlFor="password">
                                Password
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 p-2 rounded-xl"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black hover:bg-black/70 text-white font-bold py-2 px-4 rounded-xl"
                            >
                                {isSubmitting ? 'Вхід...' : 'Login'}
                            </button>

                            <p className="text-center text-black/50 font-bold hover:text-black">
                                <Link to="/register">Don't have an account? Register</Link>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    )
}
