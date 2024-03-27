import React from 'react';
import { FaSignOutAlt, FaUserCircle  } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { userProp } from '../type';

type Props = {
    setIsAuth: (isAuth: boolean) => void;
    user: userProp | null
};

const Navbar = ({ setIsAuth, user }: Props) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAuth(false)
    }
    return (
        <nav className="bg-blue-500 p-4 flex justify-between items-center">
            <span onClick={() => navigate('/home')}  className="text-white text-lg font-bold cursor-pointer">PDF Editor</span>
            <div className="flex items-center">
                <FaUserCircle 
                    className="text-white mr-4 cursor-pointer" 
                    title="Profile" 
                    onClick={() => navigate('/profile/' + user?.userId)}                
                />
                <FaSignOutAlt
                    className="text-white cursor-pointer"
                    title="Logout"
                    onClick={handleLogout}
                />
            </div>
        </nav>
    );
};

export default Navbar;
