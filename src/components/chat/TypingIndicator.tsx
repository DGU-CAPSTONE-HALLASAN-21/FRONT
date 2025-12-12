import { motion } from "motion/react";

const TypingIndicator = () => {
    return (
        <div>
            <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(18px)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
        </div>
    );
};

export default TypingIndicator;