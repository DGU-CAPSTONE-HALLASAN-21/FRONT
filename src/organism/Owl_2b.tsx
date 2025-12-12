import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three' // 1. THREE를 임포트합니다.

export function Model(props: any) {
  // 2. useRef 옆에 <THREE.Group>이라고 타입을 지정하고 (null)로 초기화합니다.
  const group = useRef<THREE.Group>(null)

  const { scene, animations } = useGLTF('/models/owl_2b.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action) action.reset().play();
    });
  }, [actions]);

  useFrame((state) => {
    // group.current가 존재하는지 확인 (TypeScript가 null일 수도 있다고 경고하므로)
    if (group.current) {
      const time = state.clock.elapsedTime;
      group.current.rotation.z = Math.sin(time * 2) * 0.1; 
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} rotation={[0.3, -0.3, 0]}/> 
    </group>
  )
}

useGLTF.preload('/models/owl.glb')