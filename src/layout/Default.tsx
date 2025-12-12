import { Sidebar } from "../organism/Sidebar";
import { ChatArea } from "../organism/ChatArea";
import { Header } from "../organism/Header";
import { motion } from "motion/react";
import { Toaster } from "sonner";

const Default = () => {
  return (
    <div className="h-full w-screen md:pt-4 lg:pt-5 px-5">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2)",
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-[1800px] mx-auto h-[calc(100vh-2rem)] md:h-[calc(100vh-32rem)] lg:h-[calc(100vh-2rem)] flex flex-col gap-3"
      >
        {/* Header */}
        <Header />

        <div className="flex gap-3 flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:block"
          >
            <div className={`h-full pb-3 flex flex-col`}>
              <Sidebar />
            </div>
          </motion.div>

          {/* Main Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <div className={`h-full pb-3 flex flex-col`}>
              <ChatArea />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Default;
