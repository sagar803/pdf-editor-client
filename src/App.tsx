import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { Auth } from './scenes/Auth/Auth';
import { Home } from './scenes/Home/Home';
import { Profile } from './scenes/Profile/Profile';
import { userProp } from './type';

function App() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<userProp | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsAuth(true);
            setUser(JSON.parse(user));
        } else {
            setIsAuth(false);
        }
    }, []);

    // Render loading state while authentication status is being determined
    if (isAuth === null) {
        return <p>Loading...</p>;
    }

    return (
        <Routes>
            <Route
                path="*" 
                element={<p>Not Found</p>} 
            />
            <Route
                path="/" 
                element={isAuth ? <Navigate to='/home'/> : <Auth isAuth={isAuth} setUser={setUser} setIsAuth={setIsAuth}/>}
            />
            <Route 
                path='/home' 
                element={isAuth ? <Home user={user} isAuth={isAuth} setIsAuth={setIsAuth}/> : <Navigate to='/'/>}
            />
            <Route
                path="/profile/:id" 
                element={isAuth ? <Profile user={user} isAuth={isAuth} setIsAuth={setIsAuth}/> : <Navigate to='/'/>}
            />
        </Routes>
    );
}

export default App;
