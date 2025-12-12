import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Guide = () => {
  // 가이드라인
  const [guidelineExpanded, setGuidelineExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setGuidelineExpanded(!guidelineExpanded)}
        className="w-full px-5 py-3 flex items-center justify-between transition-all group"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-gray-700 text-sm">빠른 가이드</span>
        </div>
        <motion.div
          animate={{ rotate: guidelineExpanded ? 180 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-purple-500 transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {guidelineExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              bounce: 0.5, // 0이면 튕김 없음, 0.3 정도면 살짝 튕김
              duration: 0.5,
            }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1">
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(167, 139, 250, 0.1)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400 mb-2" />
                  <p className="text-xs text-gray-600">
                    왼쪽에서 CSV 파일을 업로드하세요
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(6, 182, 212, 0.1)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mb-2" />
                  <p className="text-xs text-gray-600">
                    필터를 선택하여 맞춤 답변을 받으세요
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(236, 72, 153, 0.1)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-pink-400 mb-2" />
                  <p className="text-xs text-gray-600">
                    Enter로 전송, Shift+Enter로 줄바꿈
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Guide;
