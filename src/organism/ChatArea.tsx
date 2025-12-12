import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EmptyState } from "../components/chat/EmptyState";
import { FilterChips } from "@/components/chat/FilterChips";
import { toast } from "sonner";
import Guide from "@/components/chat/Guide";
import ActiveFilterList from "@/components/chat/ActiveFilterList";
import InputField from "@/components/chat/InputField";
import { getAnswer } from "@/api/chatApi";
import TypingIndicator from "@/components/chat/TypingIndicator";
import CustomMarkdown from "@/components/chat/CustomMarkdown";


// 메세지
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatArea() {
  // 메세지 배열
  const [messages, setMessages] = useState<Message[]>([]);
  // 카테고리 버튼
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // 답변 기다리면서 인디케이터 출력
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // messages[id] 배열이 바뀔 때마다 자동 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      // 부드럽게 스크롤
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); // dom요소 접근
    }
  }, [messages]);

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);

    const filterLabels: Record<string, string> = {
      analyze: "인재 추천",
      report: "사내 프로그램 관리",
      visualize: "복리후생 관리",
      export: "급여 계산",
    };

    if (newFilters.includes(filterId)) {
      toast.success(`${filterLabels[filterId]} 필터 활성화`, {
        duration: 2000,
      });
    }

    return newFilters;
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    toast.info("모든 필터가 제거되었습니다", {
      duration: 2000,
    });
  };

  const handleSend = async (input: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const data = await getAnswer(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    } catch (err) {
      console.log("Chat API error:", err);
      setIsTyping(false);
    }
  };

  return (
    // 채팅 영역 시작
    <div className="flex-1 flex flex-col h-full">
      {/* 전체 채팅 영역 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 16px -8px rgba(31, 38, 135, 0.1)",
        }}
      >
        {/* 가이드라인 토글 영역 */}
        <Guide />

        {/* Active Filters Display */}
        <ActiveFilterList
          activeFilters={activeFilters}
          onClearAllFilters={clearAllFilters}
        />

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
          ref={listRef}
        >
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => {
                const showTimestamp =
                  index === 0 ||
                  messages[index - 1].sender !== message.sender ||
                  message.timestamp.getTime() -
                    messages[index - 1].timestamp.getTime() >
                    60000;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showTimestamp && (
                      <div className="text-center mb-3">
                        <span
                          className="text-xs text-gray-400 px-3 py-1 rounded-full"
                          style={{
                            background: "rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-lg text-sm ${
                          message.sender === "user"
                            ? "rounded-tr-sm"
                            : "rounded-tl-sm"
                        }`}
                        style={
                          message.sender === "user"
                            ? {
                                background:
                                  "linear-gradient(135deg, rgba(167, 139, 250, 0.9), rgba(139, 92, 246, 0.95))",
                                backdropFilter: "blur(15px)",
                                border: "1px solid rgba(255, 255, 255, 0.5)",
                                boxShadow:
                                  "0 4px 16px 0 rgba(139, 92, 246, 0.25)",
                              }
                            : {
                                background: "rgba(255, 255, 255, 0.5)",
                                backdropFilter: "blur(18px)",
                                border: "1px solid rgba(255, 255, 255, 0.6)",
                                boxShadow:
                                  "0 4px 16px 0 rgba(31, 38, 135, 0.1)",
                              }
                        }
                      >
                        {message.sender === "user" ? (
                          <p className="text-white">{message.text}</p>
                        ) : (
                            <CustomMarkdown message={message.text} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
          )}
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div
          className="border-t border-white/20 p-5"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}
        >
          {/* Filter Chips */}
          <FilterChips
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
          />

          {/* Input Field */}
          <InputField onSend={handleSend} />
        </div>
      </motion.div>
    </div>
  );
}
