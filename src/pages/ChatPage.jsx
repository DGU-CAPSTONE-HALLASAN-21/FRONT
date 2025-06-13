import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import boxItems from "../data/boxes"; // 카테고리 및 가이드 데이터
import styles from "./ChatPage.module.css";

// 백엔드 자동완성 및 채팅 호출 URL
const AUTO_ENDPOINT = "http://localhost:8080/auto";

function ChatPage() {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(boxItems[0].title);
  const [showGuide, setShowGuide] = useState(false);

  const inputRef = useRef(null);
  const ghostRef = useRef(null);

  // textarea 높이 자동 조절 함수
  const adjustHeights = () => {
    [inputRef.current, ghostRef.current].forEach((el) => {
      if (el) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    });
  };

  // load/save messages
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("messages"));
    if (saved) setMessages(saved);
  }, [id]);
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // suggestion 또는 input 변경 시 높이 조절
  useEffect(() => {
    adjustHeights();
  }, [input, suggestion]);

  // 현재 가이드 데이터
  const currentBox = boxItems.find((item) => item.title === selectedCategory);

  // 카테고리 클릭
  const handleCategoryClick = (cat, e) => {
    setSelectedCategory(cat);
    e.currentTarget.blur();
  };

  // 입력값 변경
  const handleChange = (e) => {
    setInput(e.target.value);
    setSuggestion("");
  };

  // 스페이스바: 자동완성 요청
  // space → fetch suggestion
  const handleSpace = async (e) => {
    e.preventDefault();
    const newVal = input + " ";
    setInput(newVal);
    const trimmed = newVal.trim();

    try {
      const res = await fetch(AUTO_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: trimmed,
      });
      if (!res.ok) throw new Error(res.statusText);
      const full = await res.text();

      // 1) full에서 trimmed가 시작되는 위치
      const idx = full.indexOf(trimmed);
      // 2) 그 뒤 부분만 잘라내기
      const suffix = idx >= 0 ? full.slice(idx + trimmed.length) : full;
      // 1) 제안 문자열 앞뒤 공백을 trim 하고
      const pure = suffix.trimStart();
      // 2) 모든 공백을 non-breaking space로 치환 → 줄바꿈 기준 무시
      const noWrap = pure.replace(/ /g, "\u00A0");
      // (중요!) 여기 한 번만 호출해서 반드시 NBSP 치환된 문자열을 셋팅
      setSuggestion(noWrap);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestion("");
    }
  };

  // Tab: 제안 적용
  const handleTab = (e) => {
    if (!suggestion) return;
    e.preventDefault();
    setInput(input + suggestion);
    setSuggestion("");
  };

  // Enter: 질문 전송 및 답변 확인
  const handleEnter = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    // 사용자 메시지 저장
    setMessages((msgs) => ({
      ...msgs,
      [id]: [...(msgs[id] || []), { text, sender: "user" }],
    }));
    setInput("");

    try {
      const res = await fetch(`http://localhost:8080/folders/1/chats`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text,
      });
      if (!res.ok) throw new Error(res.statusText);
      const answer = await res.text();
      console.log("[Chat Answer]", answer);
      // 봇 메시지 저장
      setMessages((msgs) => ({
        ...msgs,
        [id]: [...(msgs[id] || []), { text: answer, sender: "bot" }],
      }));
    } catch (err) {
      console.error("Chat API error:", err);
    }
    setSuggestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") return handleSpace(e);
    if (e.key === "Tab") return handleTab(e);
    if (e.key === "Enter") return handleEnter(e);
  };

  return (
    <div className={styles.wrapper}>
      {/* 가이드 라인 접기/펼치기 */}
      <div className={styles.guideContainer}>
        <div
          className={styles.guideHeader}
          onClick={() => setShowGuide(!showGuide)}
        >
          <div className={styles.headerTitle}>
            <img
              src="/public/megaphone (2).png"
              className={styles.guideIcon}
              alt="가이드 아이콘"
            />
            <span>가이드 라인</span>
          </div>
          <span className={styles.toggleIcon}>{showGuide ? "▲" : "▼"}</span>
        </div>
        {showGuide && currentBox && (
          <div className={styles.guideContent}>
            <h4>{currentBox.title}</h4>
            {currentBox.guideLines.map((line, idx) => (
              <div key={idx}>
                <p className={styles.guideLine}>
                  <img
                    src={line.icon}
                    alt=""
                    className={styles.guideLineIcon}
                  />
                  <strong style={{ fontSize: "0.7rem" }}>{line.text[0]}</strong>
                </p>
                <p
                  className={styles.guideLineFirst}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {line.text[1]}
                </p>
                <p
                  className={styles.guideLineSecond}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {line.text[2]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className={styles.messageList}>
        {!messages[id] || messages[id].length === 0 ? (
          <div className={styles.emptyPlaceholder}>
            <img
              src="/public/owl.png"
              alt="부엉이"
              className={styles.placeholderIcon}
            />
            <p className={styles.placeholderText}>부엉~ 무엇을 도아줄까부~</p>
          </div>
        ) : (
          messages[id].map((m, i) => (
            <div
              key={i}
              className={
                m.sender === "user" ? styles.userMessage : styles.botMessage
              }
            >
              {m.sender === "bot" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.text}
                </ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
          ))
        )}
      </div>

      {/* Input & Ghost suggestion */}
      <div className={styles.inputArea}>
        <div className={styles.ghostWrapper}>
          <textarea
            ref={ghostRef}
            className={styles.ghostInput}
            value={input + suggestion}
            readOnly
            rows={1}
            onScroll={(e) => {
              // 사용자가 ghost를 스크롤하면, 입력창도 따라가도록
              if (inputRef.current) {
                inputRef.current.scrollTop = e.target.scrollTop;
              }
            }}
          />
          <textarea
            ref={inputRef}
            className={styles.chatInput}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요"
            rows={1}
            onScroll={(e) => {
              // 사용자가 입력창을 스크롤하면 ghost도 동기화
              if (ghostRef.current) {
                ghostRef.current.scrollTop = e.target.scrollTop;
              }
            }}
          />
        </div>
        <button onClick={handleEnter} className={styles.sendButton}>
          <img
            src="/public/data_loss_prevention.png"
            alt="전송"
            className={styles.sendIcon}
          />
        </button>
      </div>

      {/* Category buttons with icons */}
      <div className={styles.categoryBar}>
        {boxItems.map(({ title, Image }) => (
          <button
            key={title}
            onClick={(e) => handleCategoryClick(title, e)}
            className={`${styles.categoryButton} ${
              selectedCategory === title ? styles.selected : ""
            }`}
          >
            <img src={Image} alt={title} className={styles.categoryIcon} />
            <span>{title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChatPage;
