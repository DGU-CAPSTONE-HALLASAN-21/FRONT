import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ styles: passedStyles }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // ✅ 첫 로드 시 로컬스토리지에서 불러오기 또는 기본 생성
  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("chats"));
  if (saved && Array.isArray(saved) && saved.length > 0) {
    setChats(saved);

    // ✅ 마지막 채팅으로 이동
    const lastId = localStorage.getItem("lastChatId") || saved[saved.length - 1].id;
    navigate(`/chat/${lastId}`);
  } else {
    const defaultChat = [{ id: 1, title: "Chat 1" }];
    setChats(defaultChat);
    localStorage.setItem("chats", JSON.stringify(defaultChat));
    localStorage.setItem("lastChatId", 1); // ✅ 추가
    navigate("/chat/1");
  }
}, []);

  // ✅ chats 상태 변경 시 저장
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // ✅ 새 채팅 생성
  // handleNewChat 내부에서 마지막 ID 저장
const handleNewChat = () => {
  const newId = chats.length > 0 ? chats[chats.length - 1].id + 1 : 1;
  const newChat = { id: newId, title: `Chat ${newId}` };
  const updated = [...chats, newChat];
  setChats(updated);
  localStorage.setItem("chats", JSON.stringify(updated));
  localStorage.setItem("lastChatId", newId); // ✅ 마지막 채팅 저장
  navigate(`/chat/${newId}`);
};


  return (
    <nav className={passedStyles.sideNavbar}>
      <div className={passedStyles.sidebarHeader}>
        <button onClick={handleNewChat} className={passedStyles.sendButton}>
        <img src="/public/newchat.png" alt="전송" className={passedStyles.sendIcon} />
        </button>
      </div>

      <div className={passedStyles.sidebarScrollArea}>
        {chats.map((chat) => (
          <div key={chat.id} className={passedStyles.sidebarItem}>
            <Link to={`/chat/${chat.id}`} className={passedStyles.sidebarLink}>
              {chat.title}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
