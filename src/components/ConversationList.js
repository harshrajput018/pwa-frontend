import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConversationList.css';

const ConversationList = ({ selectedConversation, onConversationSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allfriends, setallfriends] = useState(false);
  const [all, setall] = useState([]);



  const handleSearch = () => {

    if (searchQuery == '') {
      // console.log'ddd')
      setSearchResults([])
      return;
    }
    const results = all.filter(conversation => {
      return conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
    }
    );
    // console.log'results',results);
    setSearchResults(results);



  };

  // console.logsearchResults)
  useEffect(() => {
    handleSearch();
  }, [searchQuery])

  const handleSendRequest = (conversationId) => {
    fetch('https://pwa-backend-7lcb.onrender.com//friends/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: localStorage.getItem('token'), to: conversationId })

    })
  };

  // console.log'all',all)
  // console.log'allfriends',allfriends)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('logoutFlag', 'true');
    navigate('/');
  };


  const handleFriends = () => {

    localStorage.setItem('chatWindow', 'false');
    localStorage.setItem('freinds', 'true');
    window.location.reload();

  }

  const handleChat = () => {

    localStorage.setItem('chatWindow', 'true');
    localStorage.setItem('freinds', 'false');
    window.location.reload();

  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const getFriends = () => {
    fetch('https://pwa-backend-7lcb.onrender.com//friends/getfriends', {
      headers: {
        token: localStorage.getItem('token'),
      }
    }).then((res) => res.json()).then(res => { setallfriends(res.users) })
  }
  // fetching all users for search

  const getall = () => {

    fetch('https://pwa-backend-7lcb.onrender.com/allusers/allusers').then(res => res.json()).then(res => {
      setall(res.allusers)
    })

  }
  useEffect(() => {

    getFriends()
    getall()

  }, [])

  return (

    <div id='list' className="conversation-list">
      
        
      {allfriends === false && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection:'column' }}>
        <div className="loader"></div>
        
      </div>}
      {allfriends.length > 0 ?
        <div className='showAll'>

          



          {allfriends.map((conversation) => (
            <div
              key={conversation._id}
              className={`conversation ${selectedConversation === conversation._id ? 'active' : ''}`}
              onClick={() => {

                

                onConversationSelect(conversation._id);
                localStorage.setItem('chatWindow', 'true');
                localStorage.setItem('freinds', 'false');
                localStorage.setItem('username', conversation.username)

                

                
              }}
            >
              <div className="profile-pic">
                <img id='profile-pic' src='https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg' alt={`Profile of ${conversation.name}`} />
              </div>
              <div className="conversation-info">
                <h4 className="name">{conversation.username}</h4>
              </div>
            </div>
          ))
          }
        </div> : <div style={{ fontFamily: 'sans-serif', fontSize: '2rem', padding: '1rem', paddingTop: '5rem' }}>
          YOU DON'T HAVE ANY FRIENDS YET. <button onClick={() => {
            navigate('/friends')
          }} style={{ background: 'black', color: 'white', width: 'fit', border: 'none', padding: '1rem', fontSize: '1.25rem' }}>FIND PEOPLE</button>
        </div>
      }

    </div>

  );
};

export default ConversationList;


