import React, { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './chatWindow'; // Make sure to use the correct import path
import '../styles/ChatApp.css'; // Import your CSS file for styling

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  // Use a unique key for the ChatWindow component based on selectedConversation
  const chatWindowKey = selectedConversation || 'no-conversation';

  return (
    <div>
      {localStorage.getItem('token') ? (
        <div className="chat-app">
          <div id='list' className="conversation-list-container">
            <ConversationList
              selectedConversation={selectedConversation}
              onConversationSelect={handleConversationSelect}
            />
          </div>
          <div className="chat-window-container">
            {selectedConversation ? (
              <ChatWindow key={chatWindowKey} conversationId={selectedConversation} />
            ) : (
              <div className="no-conversation-message">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                  Select a conversation to start chatting.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        'You need to login first'
      )}
    </div>
  );
};

export default ChatApp;
