import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const RegisterSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний email')
        .required('Email обов’язковий'),
    password: Yup.string()
        .min(6, 'Мінімум 6 символів')
        .required('Пароль обов’язковий')
})

export default function Register() {
    const navigate = useNavigate()
    const { register } = useAuthStore((s) => s)

    return (
        <section className="h-screen flex items-center justify-center bg-gray-100 text-black">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            await register(values.email, values.password)
                            navigate('/todo')
                        } catch (err: any) {
                            setErrors({ email: err.message || 'Помилка при реєстрації' })
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 flex flex-col">
                            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                placeholder="example@gmail.com"
                                className="w-full border border-gray-300 p-2 rounded-xl"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />

                            <label htmlFor="password" className="block text-sm font-medium mb-1">
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
                                {isSubmitting ? 'Реєстрація...' : 'Register'}
                            </button>

                            <p className="text-center text-black/50 font-bold hover:text-black">
                                <Link to="/login">Already have an account? Login</Link>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    )
}
