import { useEffect, useState } from 'react';
import '../styles/newfriends.css'
import { FaSearch } from 'react-icons/fa';

export default function NewFriends() {
    
    
   

    console.log('new')

    const changeColor = (id) => {

        if (id == 'one') {
            document.getElementById('one').style.background = '#1c5d9d'
            document.getElementById('two').style.background = '#001f3f'
            document.getElementById('three').style.background = '#001f3f'


        }
        else if (id == 'two') {
            document.getElementById('two').style.background = '#1c5d9d'
            document.getElementById('one').style.background = '#001f3f'
            document.getElementById('three').style.background = '#001f3f'


        }
        else if (id == 'three') {
            document.getElementById('three').style.background = '#1c5d9d'
            document.getElementById('two').style.background = '#001f3f'
            document.getElementById('one').style.background = '#001f3f'


        }


    }

    const [allfriends, setAllFriendsData] = useState(false);
    const [friendRequestsData, setFriendRequestsData] = useState(false)
    const [friendSentData, setFriendSentData] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [arr, setArr] = useState([]);

    const [input, setInput] = useState('');

    useEffect(() => {

        if (input === '')
            setArr([])
        else {
            const arr = allUsers.filter((elem) => {

                let query = input.toLowerCase();

                let username = elem.username.toLowerCase()

                if (username.includes(query))
                    return elem

            })

            setArr(arr)
        }

    }, [input])

    const handleSendRequest = (conversationId) => {
        fetch('https://mern-api-9vf7.onrender.com/friends/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: localStorage.getItem('token'), to: conversationId })

        })
    };

    function handleRejectFriend(id) {
        fetch('https://mern-api-9vf7.onrender.com/friends/reject', {

            headers: {
                token: localStorage.getItem('token'),
                id: id,
                friend: true
            }

        }).then(res => res.json())

        let arr = allfriends.filter(elem=>elem._id!=id)


        setAllFriendsData(arr);



    }

    function handleRejectSent(id) {
        fetch('https://mern-api-9vf7.onrender.com/friends/reject', {

            headers: {
                token: localStorage.getItem('token'),
                id: id
            }

        }).then(res => res.json()).then(()=>{
            getfriends() 
            getrequest()
            sentrequest()
        })
    }

    function handleAccept(id){
        
        fetch('https://mern-api-9vf7.onrender.com/friends/accept',{
    
        headers:{
            token: localStorage.getItem('token'),
            id: id
        }
    
        }).then(res=>res.json()).then(res=>{
            if(res.status === 'successful')
            {
                getfriends();
                getrequest();
                sentrequest()
                
            }
        })
    
        
    
      }
      function handleReject(id){
        setFriendRequestsData(false)
        fetch('https://mern-api-9vf7.onrender.com/friends/reject',{
    
        headers:{
            token: localStorage.getItem('token'),
            id: id
        }
    
        }).then(res=>res.json()).then(res=>{
            if(res.status === 'successful')
            {
                getfriends();
                getrequest();
                sentrequest()
                
            }
        })
    
        
    
      }

    const getfriends = ()=>{

        setAllFriendsData(false)

        fetch('https://mern-api-9vf7.onrender.com/friends/getfriends', {
            headers: {
                token: localStorage.getItem('token'), 
            }
        }).then((res) => res.json()).then(res => {setAllFriendsData(res.users)})

    }

    const getrequest = ()=>{

        setFriendRequestsData(false)

        fetch('https://mern-api-9vf7.onrender.com/friends/getrequest', {
            headers: {
                token: localStorage.getItem('token'),
            }
        }).then((res) => res.json()).then(res => { console.log(res); setFriendRequestsData(res.users) })
    }

    const sentrequest = ()=>{

        setFriendSentData(false)
        
        fetch('https://mern-api-9vf7.onrender.com/friends/sentrequest', {
            headers: {
                token: localStorage.getItem('token'),
            }
        }).then((res) => res.json()).then(res => { console.log(res); setFriendSentData(res.users) })
    }

    useEffect(() => {

        fetch('https://mern-api-9vf7.onrender.com/friends/getfriends', {
            headers: {
                token: localStorage.getItem('token'), 
            }
        }).then((res) => res.json()).then(res => setAllFriendsData(res.users))

        fetch('https://mern-api-9vf7.onrender.com/friends/getrequest', {
            headers: {
                token: localStorage.getItem('token'),
            }
        }).then((res) => res.json()).then(res => { console.log(res); setFriendRequestsData(res.users) })

        fetch('https://mern-api-9vf7.onrender.com/friends/sentrequest', {
            headers: {
                token: localStorage.getItem('token'),
            }
        }).then((res) => res.json()).then(res => { console.log(res); setFriendSentData(res.users) })

        fetch('https://mern-api-9vf7.onrender.com/allusers/allusers', {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then(res => res.json()).then((res) => {
            console.log(res)
            setAllUsers(res.allusers);
        })

    }, [])


    return (
        <div id='container_newFriends'>
            <div style={{ width: '50%', padding: '0', margin: '0', position: 'relative' }}>
                <div id='search-container' >
                    <div style={{ marginTop: "0.15rem", color: 'white', fontSize: '1rem' }}>
                        <FaSearch />
                    </div>
                    <input id='input' onChange={() => { setInput(document.getElementById('input').value) }}
                        onFocus={
                            () => document.getElementById('input').placeholder = ""
                        }
                        onMouseLeave={() => {
                            document.getElementById('input').placeholder = "Search People...."
                        }}
                        onMouseEnter={() => {
                            document.getElementById('input').placeholder = ""
                        }}
                        onBlur={() => {
                            document.getElementById('input').placeholder = "Search People...."
                        }} type="text" placeholder='Search People....' />
                </div>
                {arr.length > 0 &&

                    <div id='searchResults'>
                        {arr.map((elem) => {
                            return (<div>

                                <div id='allFriendsElem' ><div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        {elem.username}
                                        <div>{
                                            elem.email
                                        }</div>
                                    </div>
                                </div>
                                    <div >
                                        <div onClick={(e) => {handleSendRequest(elem._id);
                                        e.target.innerText='Sent'
                                        }} className='send'>Send
                                        </div>
                                    </div></div>

                            </div>)
                        })}
                    </div>
                }

            </div>




            <div id="btns">
                <li id='one' style={{ borderRight: 'solid 1px wheat',fontSize:'0.75rem', fontFamily:'Montserrat', fontWeight:'bolder' }} onClick={() => {
                    changeColor('one');
                    document.getElementById('first').style.display = 'block';
                    document.getElementById('second').style.display = 'none';
                    document.getElementById('third').style.display = 'none';

                    getfriends()

                }}>ALL FRIENDS</li>
                <li id='two' style={{ borderRight: 'solid 1px wheat', fontFamily:'Montserrat', fontWeight:'bolder',fontSize:'0.75rem', }} onClick={() => {
                    changeColor('two')
                    document.getElementById('second').style.display = 'block';
                    document.getElementById('first').style.display = 'none';
                    document.getElementById('third').style.display = 'none';

                    getrequest()
                }}>REQUESTS</li>
                <li id='three'
                style={{borderRight: 'solid 1px wheat', fontFamily:'Montserrat', fontWeight:'bolder',fontSize:'0.75rem',}}
                 onClick={() => {
                    changeColor('three')
                    document.getElementById('second').style.display = 'none';
                    document.getElementById('first').style.display = 'none';
                    document.getElementById('third').style.display = 'block';

                    sentrequest();
                }}>SENT REQUESTS</li>
            </div>

            <div style={{ display: 'none' }} id='first' className='newFriendsTable'>
                {allfriends===false ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'
             }}>
        <div className="loader"></div>
        
      </div> : <>
      { allfriends.length>0 ? allfriends.map((elem) => {
                    return (<div id='listitem' style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80" alt="" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '75%', alignItems:'center'}}>
                            <div>{elem.username}</div>
                            <div className='send' onClick={() => {
                                handleRejectFriend(elem._id)

                            }}> remove </div>
                        </div>

                    </div>)
                }): 'No Friends'}
      </>}   
                
            </div>
            <div id='second' className='newRequestTable' style={{ display: 'none' }} >
            {friendRequestsData===false ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'
             }}>
        <div className="loader"></div>
        
      </div> : <>
      {friendRequestsData.length > 0 ? friendRequestsData.map((elem) => {
                    return (<div id='listitem' style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <img src="https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg" alt="" />
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', width:'75%', alignItems:'center'}}>
                        <div>{elem.username}</div>
                        <div style={{display:'flex', gap:'1rem'}}>
                        <div className='send' onClick={() => {
                            handleAccept(elem._id)

                        }}> Accept </div>
                        <div className='send' onClick={() => {
                            handleReject(elem._id)

                        }}> Reject </div>
                        </div>
                        
                        </div>

                    </div>)
                }) : 'No Requests'}</>}
                
            </div>
            <div id='third' style={{ display: 'none' }} className='newSentTable'>
            {friendSentData===false ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'
             }}>
        <div className="loader"></div>
        
      </div> : <>
      {friendSentData.length > 0 ? friendSentData.map((elem) => {
                    return (<div id='listitem' style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <img src="https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg" alt="" />
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', width:'75%', alignItems:'center'}}>
                        <div>{elem.username}</div>
                        <div className='send' onClick={() => {
                            handleRejectSent(elem._id)

                        }}> remove </div>
                        </div>
                        
                    </div>)
                }) : 'No Requests'}
      </>}
                
            </div>
        </div>

    )
}