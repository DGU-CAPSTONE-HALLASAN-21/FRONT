import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ActiveFilterProps {
  activeFilters: string[];
  onClearAllFilters: () => void;
}

export function ActiveFilterList({
  activeFilters,
  onClearAllFilters,
}: ActiveFilterProps) {
  return (
    <div>
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/20 overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="px-5 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-600">활성 필터:</span>
              <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                {activeFilters.map((filter) => {
                  const labels: Record<string, string> = {
                    analyze: "인재 추천",
                    report: "사내 프로그램 관리",
                    visualize: "복리후생 관리",
                    export: "급여 계산",
                  };
                  return (
                    <motion.span
                      key={filter}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="px-2 py-0.5 rounded-full text-xs text-purple-700"
                      style={{
                        background: "rgba(167, 139, 250, 0.2)",
                      }}
                    >
                      {labels[filter]}
                    </motion.span>
                  );
                })}
              </div>
              <button
                onClick={onClearAllFilters}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                전체 해제
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActiveFilterList;
