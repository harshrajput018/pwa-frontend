
import ChatApp from './components/ChatApp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Newfriends from './components/newfriends';
import Nav from './components/nav';
import Chatbot from './components/chatbot';
import PublicChatWindow from './components/groupChat';



function App() {
  
  return (
    <div  className="App">
      
      <BrowserRouter>
      {console.log('app')}
      <Nav/>
      
      
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path='/public' element={<PublicChatWindow/>}/>
          <Route path='/chat' element={<ChatApp/>}/>
          <Route path='/friends' element={<Newfriends/>}/>
          <Route path='/chatbot' element={<Chatbot/>}/>
          
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
