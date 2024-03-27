import React, { useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import * as Yup from 'yup';
import { Loader } from '../Loader/Loader';
import { userProp } from '../../type';
import { authProps } from '../../type';
import { CredentialsProps } from '../../type';

export const Auth = ({ isAuth, setUser, setIsAuth }: authProps) => {
    const navigate: NavigateFunction = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pageType, setPageType] = useState("login");
    const [credentials, setCredentials] = useState<CredentialsProps>({ name: '', email: '', password: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const togglePageType = () => {
        setCredentials({ name: '', email: '', password: '' });
        setFormErrors({});
        setPageType(pageType === "login" ? "register" : "login");
    }

    // Validation schema for the registration form
    const registrationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    // Validation schema for the login form
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const schema = pageType === 'login' ? loginSchema : registrationSchema;
            await schema.validate(credentials, { abortEarly: false });
            setLoading(true);
            const res = await fetch(`${process.env.REACT_APP_API}/${pageType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })
            if (res.ok) {
                const data = await res.json();
                console.log(data.user);
                setUser({ userId: data.user._id, userName: data.user.name, token: data.token});
                localStorage.setItem("user", JSON.stringify({ userId: data.user._id, userName: data.user.name, token: data.token})); // Stringify data.user
                setIsAuth(true);
                navigate('/home');
            }
        } catch (error : any) {
            console.log(error);
            if (error.inner) {
                // Validation failed, update the formErrors state with the error messages
                const errors: Record<string, string> = {};
                error.inner.forEach((e: Yup.ValidationError) => {
                    if (e.path) { // Check if e.path exists
                        errors[e.path] = e.message;
                    }
                });
                setFormErrors(errors);
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-blue-500">
            <div className=" md:w-[500px] rounded-lg bg-white flex items-center flex-col text-center p-8 shadow-md">
                <h1 className="text-blue-500 text-2xl font-bold mb-4">PDF EDITOR</h1>
                <form className="w-85" onSubmit={handleSubmit}>
                    {(pageType === "register") && (
                        <>
                            {formErrors.name && <div className="text-red-500 text-left text-sm mb-2">{formErrors.name}</div>}
                            <input
                                value={credentials.name}
                                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                                type='text'
                                placeholder="Enter your name.."
                                className="w-full bg-gray-200 text-gray-600 text-lg outline-none rounded-md transition duration-100 focus:border-blue-500 px-4 py-3 mb-3"
                            />
                        </>
                    )}
                    {formErrors.email && <div className="text-red-500 text-left text-sm mb-2">{formErrors.email}</div>}
                    <input
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        type='text'
                        placeholder="Email"
                        className="w-full bg-gray-200 text-gray-600 text-lg outline-none rounded-md transition duration-100 focus:border-blue-500 px-4 py-3 mb-3"
                    />
                    {formErrors.password && <div className="text-red-500 text-left text-sm mb-2">{formErrors.password}</div>}
                    <input
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        type='password'
                        placeholder="Password"
                        className="w-full bg-gray-200 text-gray-600 text-lg outline-none rounded-md transition duration-100 focus:border-blue-500 px-4 py-3 mb-3"
                    />
                    <button
                        type='submit'
                        className="w-full bg-blue-500 text-white text-lg rounded-md py-2 px-4 mb-4 transition duration-300 hover:bg-blue-600"
                    >
                        {loading ? <Loader /> : (pageType === "login") ? "Login" : "Register"}
                    </button>
                    <p
                        className='text-blue-500 font-semibold text-sm cursor-pointer'
                        onClick={togglePageType}
                    >{(pageType === "login") ? "Register here" : "Login here"}</p>
                </form>
            </div>
        </div>
    )
}
