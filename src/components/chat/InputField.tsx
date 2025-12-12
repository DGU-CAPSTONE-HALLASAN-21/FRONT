import React, { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import {debounce} from "lodash"
import { getAutoComplete } from "@/api/chatApi";

interface InputAreaProps {
  onSend: (input: string) => void;
}

const InputArea = ({ onSend }: InputAreaProps) => {
  // 입력창
  const [input, setInput] = useState("");
  // 추천문장
  const [suggestion, setSuggestion] = useState("")

  const fetchSuggestion = useMemo(
    () => debounce(async(text: string) => {
      // 아무것도 입력하지 않았을때
      if(!text.trim()){
        setSuggestion("")
        return
      }

      try{
        const result = await getAutoComplete(text)
        console.log(result)
        setSuggestion(result)
      } catch (err) {
        console.log("AutoComplete error: ", err)
      }
    }, 500), []
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInput(newVal);
    setSuggestion(""); // 타이핑 중엔 추천 안 보이게 끄기
    fetchSuggestion(newVal);
    
  };

  // ChatArea에서 질문 전송 및 답변 확인 요청을 보낼 수 있게 input 넘겨줌
  const handleTrigger = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    setSuggestion("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTrigger();
    }
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      setInput(input + suggestion); 
      setSuggestion("");
    }
  };

const sharedStyle = "font-sans text-sm leading-relaxed px-4 py-3 w-full";

  return (
    <div>
      <div className="flex items-end gap-3 mt-3">
        <div
          className="flex-1 rounded-xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
          }}
        >
          {/* [Ghost Layer] 뒷배경: 실제 텍스트(투명) + 추천 텍스트(회색) */}
          <div
            className={`absolute inset-0 pointer-events-none whitespace-pre-wrap break-words overflow-hidden ${sharedStyle}`}
            aria-hidden="true"
            style={{ maxHeight: "120px" }} // textarea와 max-height 일치시킴
          
          >
            {/* 핵심 트릭: 입력한 텍스트만큼 투명하게 자리를 차지함 */}
            <span className="invisible">{input}</span>
            <span className="text-gray-400 opacity-60">{suggestion}</span>
          </div>
          <textarea
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요... (Enter로 전송)"
            className={`relative z-10 bg-transparent resize-none outline-none text-gray-700 placeholder-gray-400 overflow-y-auto ${sharedStyle}`}
            rows={1}
            style={{
              minHeight: "48px",
              maxHeight: "120px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTrigger}
          disabled={!input.trim()}
          className={`
                p-3 rounded-xl transition-all duration-200 shadow-lg
                ${
                  input.trim()
                    ? "text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
          style={
            input.trim()
              ? {
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  boxShadow: "0 4px 20px 0 rgba(236, 72, 153, 0.4)",
                }
              : {}
          }
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default InputArea;
