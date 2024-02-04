import React, { useState, useEffect } from 'react';
import '../styles/FriendsComponent.css';

const FriendsComponent = () => {
  const [activeTab, setActiveTab] = useState('allFriends');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [allFriendsData,setAllFriendsData] = useState(
  [
    
  ])

  const getFriends = ()=>{
    fetch('https://pwa-backend-7lcb.onrender.com/friends/getfriends',{
        headers:{
            token: localStorage.getItem('token'),
        }
    }).then((res)=>res.json()).then(res=>setAllFriendsData(res.users))}



  const [friendRequestsData,setFriendRequestsData] = useState([
    
    // Add more friend requests here
  ])
  const getrequest = ()=>{
    fetch('https://pwa-backend-7lcb.onrender.com/friends/getrequest',{
        headers:{
            token: localStorage.getItem('token'),
        }
    }).then((res)=>res.json()).then(res=>{setFriendRequestsData(res.users)})
  }
  useEffect(()=>{

    getFriends();
    getrequest();
    
  },[])

  function handleAccept(id){
    fetch('https://pwa-backend-7lcb.onrender.com/friends/accept',{

    headers:{
        token: localStorage.getItem('token'),
        id: id
    }

    }).then(res=>res.json()).then(res=>{
      
        if(res.status=='successful')
        {
            getrequest();
        }
    })

    

    
  }

  function handleReject(id){
    fetch('https://pwa-backend-7lcb.onrender.com/friends/reject',{

    headers:{
        token: localStorage.getItem('token'),
        id: id
    }

    }).then(res=>res.json()).then(res=>{
        if(res.status === 'successful')
        {
            getrequest();
            
        }
    })

    

  }

  return (
    <div className="friends-component">
      <div className="tabs">
        <button style={{color:"black"}}
          className={`tab-button ${activeTab === 'allFriends' ? 'active' : ''}`}
          onClick={() => {handleTabChange('allFriends' );getFriends()}}
        >
          All Friends
        </button>
        <button style={{color:'black'}}
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => {handleTabChange('requests'); getrequest()}}
        >
          Requests
        </button>
      </div>
      <div className="content">
        {activeTab === 'allFriends' && (
          <div className="friends-list">
            {allFriendsData.map((friend) => (
              <div key={friend._id} className="friend-item">
                <img src='https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg' alt={friend.name} />
                <p>{friend.username}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'requests' && (
          <div className="requests-list">
            {friendRequestsData.map((request) => (
              <div key={request._id} className="request-item">
                <img src='https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg' alt={request.username} />
                <p>{request.username}</p>
                <button className="accept-button" onClick={()=>{
                    handleAccept(request._id)
                }}>Accept</button>
                <button className="reject-button" onClick={()=>{handleReject(request._id)}}>Reject</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsComponent;
