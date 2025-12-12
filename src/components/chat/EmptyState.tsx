import { motion } from "motion/react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls} from "@react-three/drei";
import { Model as Owl } from "../../organism/Owl_2b"


export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full px-8 py-12"
    >
      {/* Owl Image - Smaller */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-4"
      >
        <div className="w-40 h-40 mx-auto relative">
          {/* Canvas 컴포넌트: 3D 렌더링 영역 */}
         <Canvas camera={{ position: [0, 1, 10], fov: 40 }}>
            {/* 조명 */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <Environment preset="city" />

            <Suspense fallback={null}>
              {/* 모델 배치 */}
              {/* scale: 크기, position: 위치(y를 내려서 중앙 맞춤) */}
              <Owl scale={0.3} position={[0, -0.8, 0]} />
            </Suspense>

            {/* 마우스 조작 (필요 없으면 제거) */}
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-gray-600 text-sm">부엉~ 무엇을 도와줄까요~</p>
      </motion.div>
    </motion.div>
  );
}
