import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import ChatPage from './pages/ChatPage'; // 아래 예시 같이 생성

function App() {

  const HeaderTitle = "HRCOPILOT";
  const FooterMessage = "종합설계 한라산21도";
  
  return (
    <Routes>
      <Route path="/" element={<Layout
              title={HeaderTitle}
              footermessage={FooterMessage}
            />}>
        <Route path="chat/:id" element={<ChatPage />} />
        <Route index element={<ChatPage />} /> {/* 기본 접속도 ChatPage */}
      </Route>
    </Routes>
  );
}

export default App;
