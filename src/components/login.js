// HomePage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; // Import your CSS file for styling

const Login = () => {

    
    

    const navigate = useNavigate();
    const location = useLocation();

    const [count,setCount]= useState(0);
    const [c,changeToBlock]= useState('block');

    useEffect(()=>{
        if(localStorage.getItem('token'))
        {
            navigate('/chat')
        }
    },[])

    useEffect(()=>{
        if(c=='none')
        changeToBlock('block')
    },[c])
   useEffect(()=>{

    if (localStorage.getItem('badcredentials') === 'true')
            setTimeout(() => {
                localStorage.removeItem('badcredentials');
                changeToBlock('none')
                
            }, 2000);

   },[count])

    




    const [activeForm, setActiveForm] = useState('login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (localStorage.getItem('logoutFlag') === 'true')
            setTimeout(() => {
                localStorage.removeItem('logoutFlag');
                document.getElementById('msg').style.display='none' // Trigger re-render to remove the message
            }, 1200);

        if(localStorage.getItem('signup') === 'true')
        {
            setTimeout(() => {
                localStorage.removeItem('signup');
                document.getElementById('msg1').style.display='none' // Trigger re-render to remove the message
            }, 2000);
        }
    }, [activeForm])

    const toggleForm = () => {
        setActiveForm(activeForm === 'login' ? 'signup' : 'login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (activeForm === 'signup')
            fetch('https://pwa-backend-7lcb.onrender.com/allusers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password })
            }).then(res=>res.json()).then(res=>{
                if(res.user)
                {
                    setActiveForm('login')
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                    })
                    localStorage.setItem('signup','true');
                    
                }
                })

            
        else {

            localStorage.setItem('user',formData.username)

            fetch('https://pwa-backend-7lcb.onrender.com/allusers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: formData.username, password: formData.password })
            }).then(res => res.json()).then(res => {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    navigate('/chat')

                    
                }
                else{
                    
                    localStorage.setItem('badcredentials','true')
                    console.log('error',localStorage.getItem('badcredentials'))
                    setCount(count+1);
                }
            });

            

        }

        // Handle login or signup logic here
        // console.log'Form submitted:', formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="home-page">
            {(localStorage.getItem('logoutFlag') == 'true') && <div  id='msg' style={{
                background: '#63a69f',
                color: '#fff',
                padding: '10px',
                textAlign: 'center',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                zIndex: '999',
                animation: 'slideIn 0.5s ease-in-out',
                fontFamily: 'Arial, sans-serif',
            }}>
                Successfully Logged Out
            </div>}
      {(localStorage.getItem('signup') == 'true') && <div  id='msg1' style={{
                background: '#63a69f',
                color: '#fff',
                padding: '10px',
                textAlign: 'center',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                zIndex: '999',
                animation: 'slideIn 0.5s ease-in-out',
                fontFamily: 'Arial, sans-serif',
            }}>
                Successfully Signed Up
            </div>}
            {(localStorage.getItem('badcredentials') == 'true') && <div  id='msg2' style={{
                display:c,
                background: 'red',
                color: '#fff',
                padding: '10px',
                textAlign: 'center',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                fontWeight:'700',
                zIndex: '999',
                animation: 'slideIn 0.5s ease-in-out',
                fontFamily: 'Arial, sans-serif',
            }}>
                Wrong Credentials
            </div>}
            <div className="form-container">
                <div className="form-tabs">
                    <button
                        className={`tab-button ${activeForm === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveForm('login')}
                    >
                        Log In
                    </button>
                    <button
                        className={`tab-button ${activeForm === 'signup' ? 'active' : ''}`}
                        onClick={() => setActiveForm('signup')}
                    >
                        Sign Up
                    </button>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {activeForm === 'signup' && (
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    )}

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">{activeForm === 'login' ? 'Log In' : 'Sign Up'}</button>
                </form>
                <p className="toggle-form" onClick={toggleForm}>
                    {activeForm === 'login'
                        ? 'Don\'t have an account? Sign up'
                        : 'Already have an account? Log in'}
                </p>
            </div>
        </div>
    );
};

export default Login;