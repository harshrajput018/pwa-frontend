import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/ChatWindow.css'; // Update this path as needed

const PublicChatWindow = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const socketRef = useRef(null);

  
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  useEffect(() => {
    fetch('https://pwa-backend-7lcb.onrender.com/getpublicchats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'from': localStorage.getItem('token')
        // Removed 'from' and 'to' headers since we're loading public messages
      },
    })
    .then(res => res.json())
    .then(data => {

        console.log(data)
      setLoader(false);
      const fetchedMessages = data.msgs.map(message => {
        if (message.videoData && message.videoData.data && message.videoData.data.length > 0) {
          const videoArray = new Uint8Array(message.videoData.data);
          const videoBlob = new Blob([videoArray], { type: 'video' });
          message.videoUrl = URL.createObjectURL(videoBlob);
          message.filename = `video_${message._id}.mp4`; // This assumes _id is a unique identifier
        }
        return message;
      });
      setMessages(fetchedMessages); // Assuming setMessages is the function to update your state for public messages
    })
    .catch(error => {
      console.error("Failed to fetch public messages:", error);
      setLoader(false);
    });
  }, []); // Removed conversationId from dependencies as it's not needed for public messages
  

  useEffect(() => {
    // Initialize socket connection only once
    socketRef.current = io('https://pwa-backend-7lcb.onrender.com/', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'), // Ensure secure handling of the token
      },
    });
  
    socketRef.current.on('message', (res) => {
      // Update the conversation state with the new message
      const updatedMessages = res.msgs.map(message => {
        if (message.videoData && message.videoData.data && message.videoData.data.length > 0) {
          const videoArray = new Uint8Array(message.videoData.data);
          const videoBlob = new Blob([videoArray], { type: 'video' });
          message.videoUrl = URL.createObjectURL(videoBlob);
          message.filename = `video_${message._id}.mp4`; // This assumes _id is a unique identifier
        }
        return message;
      });
      setMessages((prevMessages) => [...prevMessages, ...updatedMessages]);
    });
  
    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
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

    console.log('jjj')

    const sendMessage = (videoData = null) => {

      console.log(selectedVideoFile,newMessage)
        socketRef.current.emit('message', {
            
            time: new Date().toISOString(),
            from: localStorage.getItem('token'),
            type:'public',
            username:localStorage.getItem('user'),
            
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
      <div className="message-list" ref={messageListRef}>
        {messages.map((message, index) => (
            
          <div key={index} className={`message ${localStorage.getItem('user') === message.username ? 'sent' : 'received'}`}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'start', backgroundColor:'lightgray', padding:'1rem'}}>
              <strong>{message.sender}{message.username}: </strong>
              {message.content && <p className="message-text">{message.content}</p>}
              
              {message.videoUrl && (
        <div>
          <a href={message.videoUrl} download={message.filename || "video.mp4"}>
            Download Video
          </a>
        </div>
      )}
            </div>
          </div>
        ))}
      </div>
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

export default PublicChatWindow;