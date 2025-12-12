import { motion } from 'motion/react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div
        className="rounded-xl px-5 py-2 shadow-lg flex items-center justify-between"
        style={{
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              boxShadow: '0 4px 12px 0 rgba(236, 72, 153, 0.3)',
            }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white text-sm">HR</span>
          </motion.div>
          <motion.h1 
            className="tracking-wider"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: 'linear-gradient(90deg, #ec4899, #a855f7, #06b6d4, #ec4899)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1.25rem',
              fontWeight: '700',
            }}
          >
            HRCOPILOT
          </motion.h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg text-white text-sm shadow-md"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            boxShadow: '0 4px 20px 0 rgba(236, 72, 153, 0.3)',
          }}
        >
          로그인
        </motion.button>
      </div>
    </motion.header>
  );
}
