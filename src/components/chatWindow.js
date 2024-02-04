import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/ChatWindow.css'; // Update this path as needed

const ChatWindow = ({ conversationId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setConversation] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const messageListRef = useRef(null);
  const socketRef = useRef(null); // Ref to store the socket connection

  useEffect(() => {
    // Initialize socket connection only once
    socketRef.current = io('https://pwa-backend-7lcb.onrender.com/', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'), // Ensure secure handling of the token
      },
    });
  
    socketRef.current.on('send', (res) => {
      // Update the conversation state with the new message
      const updatedMessages = res.msgs.map(message => {
        if (message.videoData && message.videoData.data && message.videoData.data.length > 0) {
          const videoArray = new Uint8Array(message.videoData.data);
          const videoBlob = new Blob([videoArray], { type: 'video/mp4' });
          message.videoUrl = URL.createObjectURL(videoBlob);
          message.filename = `video_${message._id}.mp4`; // This assumes _id is a unique identifier
        }
        return message;
      });
      setConversation((prevMessages) => [...prevMessages, ...updatedMessages]);
    });
  
    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {
    fetch('https://pwa-backend-7lcb.onrender.com/getchats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'from': localStorage.getItem('token'),
        'to': conversationId,
      },
    })
    .then(res => res.json())
    .then(data => {
      setLoader(false)
      const fetchedMessages = data.msgs.map(message => {
        if (message.videoData && message.videoData.data && message.videoData.data.length > 0) {
          const videoArray = new Uint8Array(message.videoData.data);
          const videoBlob = new Blob([videoArray], { type: 'video/mp4' });
          message.videoUrl = URL.createObjectURL(videoBlob);
          message.filename = `video_${message._id}.mp4`; // This assumes _id is a unique identifier
        }
        return message;
      });
      setConversation(fetchedMessages); // Replace existing messages
    });
  }, [conversationId]); // Only re-run this effect if conversationId changes
  
  
  

  useEffect(() => {
    // Auto-scroll to the latest message
    const timer = setTimeout(() => {
      const messageList = messageListRef.current;
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideoFile(file);
      setShowVideoPreview(true);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedVideoFile) return;

    

    const sendMessage = (videoData = null) => {

      console.log(selectedVideoFile,newMessage)
        socketRef.current.emit('send', {
            fromtoken: localStorage.getItem('token'),
            to: conversationId,
            content: {
                text: newMessage,
                videoData, // Send the ArrayBuffer directly
            },
            time: new Date().toISOString(),
        });
        // Reset state
        setNewMessage('');
        if (selectedVideoFile) {
            setSelectedVideoFile(null);
            setShowVideoPreview(false);
        }
    };

    if (selectedVideoFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Now, `event.target.result` contains the video data as an ArrayBuffer
            sendMessage(event.target.result);
        };
        reader.onerror = (error) => console.error('Error reading file:', error);
        reader.readAsArrayBuffer(selectedVideoFile);
    } else {
        sendMessage();
    }
};


  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2 className="chat-title">{localStorage.getItem('username')}</h2>
      </div>
      {loader ?  <div style={{flex:'1 1'}}><div  className='loader'></div></div>: <></>}
      {messages.length>0 ? 
      <div className="message-list" ref={messageListRef}>

      

      

      {messages.map((message, index) => (
  <div key={index} className={`message ${message.to === conversationId ? 'sent' : 'received'}`}>
    <div className="message-content">
      {message.content && <p className="message-text">{message.content}</p>}
      {message.videoUrl && (
        <div>
          <br />
          <a href={message.videoUrl} download={message.filename || "video.mp4"}>
            Download Video
          </a>
        </div>
      )}
    </div>
  </div>
))}


</div>: !loader ? <div style={{color:'blue', flex:'1 1'}}>No messages. Start a conversation.</div>: ''}
      

      {showVideoPreview && (
        <div>
          <video controls width="400" src={URL.createObjectURL(selectedVideoFile)}></video>
          <button onClick={() => { setSelectedVideoFile(null); setShowVideoPreview(false); }}>Clear Video</button>
        </div>
      )}
      <div className="message-input-container">
        <input type="file" onChange={handleUpload} />
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
