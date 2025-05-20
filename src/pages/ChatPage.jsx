import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import boxItems from "../data/boxes";
import styles from "./ChatPage.module.css";

function ChatPage() {
  const { id } = useParams(); // 현재 채팅방 ID
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState({});
  const [boxState, setBoxState] = useState({}); // 박스 보여줄지 말지: { [id]: true/false }

  // 박스 보여줄지 여부 결정
  const showBoxes = boxState[id] ?? true;

  // 초기화: 메시지와 박스 상태 불러오기
  useEffect(() => {
    const savedMsgs = JSON.parse(localStorage.getItem("messages"));
    if (savedMsgs) setMessages(savedMsgs);

    const savedBoxes = JSON.parse(localStorage.getItem("boxState"));
    if (savedBoxes) setBoxState(savedBoxes);
  }, [id]);

  // 메시지 변경 시 저장
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // 박스 상태 저장
  useEffect(() => {
    localStorage.setItem("boxState", JSON.stringify(boxState));
  }, [boxState]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed.length > 0) {
      const updated = {
        ...messages,
        [id]: [...(messages[id] || []), trimmed],
      };
      setMessages(updated);
      setInput("");

      // ✅ 박스를 안보이도록 설정
      const updatedBoxState = {
        ...boxState,
        [id]: false,
      };
      setBoxState(updatedBoxState);
    }
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={styles.wrapper}>
      {showBoxes ? (
        <div className={styles.boxGrid}>
          {boxItems.map((box, i) => (
            <div key={i} className={styles.box}>
              <div className={styles.titleRow}>
                {" "}
                {/* ✅ 이미지 + 텍스트 수평 정렬 */}
                <img
                  src={box.Image}
                  alt={box.title}
                  className={styles.boxImage}
                />
                <h5>{box.title}</h5>
              </div>
              <p>{box.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.messageList}>
          {(messages[id] || []).map((msg, i) => (
            <div key={i} className={styles.message}>
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* 항상 아래 붙는 input 영역 */}
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={(e) => activeEnter(e)}
          placeholder="질문을 입력하세요"
        />
        <button onClick={handleSubmit} className={styles.sendButton}>
          <img src="/public/data_loss_prevention.png" alt="전송" className={styles.sendIcon} />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
