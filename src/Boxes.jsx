import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame} from '@react-three/fiber'
import { CameraControls, useHelper, Stars, Loader } from '@react-three/drei'
import "./Boxes.css";
import { PointLightHelper } from 'three';
import * as THREE from 'three';

function Box({position, size, color, name}) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const [hovered, hover] = useState()
    //const [clicked, click] = useState(false)

    useFrame((state, delta) => {
      ref.current.rotation.x += delta * 0.2
      //ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
    })

    return (
      <mesh
        position={name == 'Sun' ? [0, 0, 0] : position}
        ref={ref}
        //scale={clicked ? 1 : 1}
        onClick={(event) => bodyClicked(name, position.x)}
        onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        onPointerOut={(event) => hover(false)}
        name={name}>
        <sphereGeometry args={size} />
        <meshStandardMaterial color={hovered ? 'hotpink' : color}/>
      </mesh>
    )
}

function bodyClicked(name, x){
  console.log(name)
  //cameraConfig = {position:[x, 0, 1200000], far: 0x10000000}; Al clicar cambiar la camara justo al frente del objeto
}

function Scene ({simpleBodies, moons, complexBodies, bodyToGo, setBodyToGo}) {
  const pointLightRef = useRef()
  const cameraControlsRef = useRef()
  const [cameraCoords, setCameraCoords] = useState(false)
  const [frameNeeded, setFrameNeeded] = useState(false)

  useHelper(pointLightRef, PointLightHelper, 0.5, 'black')

  useFrame((state, delta) => {
    if(frameNeeded && bodyToGo){
      setCameraCoords(state.scene.getObjectByName(bodyToGo).position)
      //state.camera.lookAt(cameraCoords); Apuntar al objeto (posiblemente sea igual a lo que hara el bodyClicked)
      //state.camera.position.lerp(cameraCoords, .01); Moverse al objeto
      setFrameNeeded(false)
      setBodyToGo(null)
    }
  })
  useEffect(()=>{ //La primera vez siempre devuelve coordenadas false
    if(bodyToGo){
      console.log(bodyToGo)
      setFrameNeeded(true)
      console.log(cameraCoords)
    }
  }, [bodyToGo])
  
  return(
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} ref={pointLightRef} />
      {simpleBodies.map((body)=>(
        <Box key={body.englishName} name={body.englishName} position={[body.semimajorAxis/10, 0, 0]} size={[body.meanRadius, 100, 100]} color={'white'} />
      ))}
      {complexBodies.map(body =>{
        var planetMoons = [];
        body.moons.forEach(moon => {
          moons.forEach(posibleMoon =>{
            if (posibleMoon.name == moon.moon){
              planetMoons.push(posibleMoon)
            }
          })
        });
        return(<group key={body.englishName + "Group"} name={body.englishName} position={[body.semimajorAxis/10, 0, 0]}>
          <Box key={body.englishName} name={body.englishName} position={[0, 0, 0]} size={[body.meanRadius, 100, 100]} color={'white'} />
          <>
          {planetMoons.map((moon)=>(
            <Box key={moon.englishName} name={moon.englishName} position={[moon.semimajorAxis/10 + body.meanRadius, 0, 0]} size={[moon.meanRadius, 100, 100]} color={'white'} />
          ))}
          </>
        </group>)
      })}
      <CameraControls makeDefault ref={cameraControlsRef} minDistance={500} maxDistance={5000000} />
      <Stars radius={1000000000} depth={50} count={10000} factor={40} saturation={0} fade speed={0.1}/>
    </>
  )
}

export default function Boxes({simpleBodies, moons, complexBodies, setBodyToGo, bodyToGo}) {
  return (
      <div className='Boxes'>
        <p>aaaa</p>
          <Canvas camera={{position:[0, 0, 1200000], far: 0x10000000}}>
              <Scene simpleBodies={simpleBodies} moons={moons} complexBodies={complexBodies} bodyToGo={bodyToGo} setBodyToGo={setBodyToGo}/>
          </Canvas>
          <Loader />
      </div>
  )
}