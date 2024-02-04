import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame} from '@react-three/fiber'
import { CameraControls, useHelper, Stars, Loader } from '@react-three/drei'
import "./Boxes.css";
import { PointLightHelper } from 'three';
import * as THREE from 'three';
//Fisicas de la camara para limitar min distance en la camara y solucionar el bug que no deja acercarse
function Box({position, size, color, name, setBodyToGo}) {
    const ref = useRef()
    const [hovered, hover] = useState()

    useFrame((state, delta) => {
      ref.current.rotation.x += delta * 0.2
      //ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
    })

    return (
      <mesh
        position={name == 'Sun' ? [0, 0, 0] : position}
        ref={ref}
        onClick={() => bodyClicked(name, setBodyToGo)}
        onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        onPointerOut={(event) => hover(false)}
        name={name}>
        <sphereGeometry args={size} />
        <meshStandardMaterial color={hovered ? 'hotpink' : color}/>
      </mesh>
    )
}

function bodyClicked(name, setBodyToGo){
  console.log(name)
  setBodyToGo(name)
}

function Scene ({simpleBodies, moons, complexBodies, bodyToGo, setBodyToGo}) {
  const pointLightRef = useRef()
  const cameraControlsRef = useRef(null)
  const [cameraCoords, setCameraCoords] = useState(null)
  const [frameNeeded, setFrameNeeded] = useState(false)

  useHelper(pointLightRef, PointLightHelper, 0.5, 'black')

  useFrame(state => {
    if(frameNeeded){
      setCameraCoords(state.scene.getObjectByName(bodyToGo).position)
      //Tiene isGroup y el primer hijo es siempre el planeta ------ boundingBox? con computeboundingbox no funciona
      console.log(state.scene.getObjectByName(bodyToGo)) //1.7
      setFrameNeeded(false)
      setBodyToGo(null)
    }
  })
  useEffect(()=>{ //La primera vez siempre devuelve coordenadas false (se debe ejecutar con el inicio)
    if(bodyToGo){
      console.log(bodyToGo)
      setFrameNeeded(true)
    }
  }, [bodyToGo])
  useEffect(()=>{
    if(cameraCoords){
      var cameraToBody = (bodyToGo = "Sun") ? 1200000 : 700000 //cameraCoords.z  + state.scene.getObjectByName(bodyToGo).meanRadius * 1.7
      cameraControlsRef.current?.setLookAt(cameraCoords.x, cameraCoords.y, cameraToBody, cameraCoords.x, cameraCoords.y, cameraCoords.z, true);
      console.log(cameraCoords)
      //console.log(state.scene.getObjectByName(bodyToGo)) //1.7
    }
  }, [cameraCoords])
  
  return(
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} ref={pointLightRef} />
      {simpleBodies.map((body)=>(
        <Box key={body.englishName} name={body.englishName} position={[body.semimajorAxis/10, 0, 0]} size={[body.meanRadius, 100, 100]} color={'white'} setBodyToGo={setBodyToGo} />
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
          <Box key={body.englishName} name={body.englishName} position={[0, 0, 0]} size={[body.meanRadius, 100, 100]} color={'white'} setBodyToGo={setBodyToGo} />
          <>
          {planetMoons.map((moon)=>(
            <Box key={moon.englishName} name={moon.englishName} position={[moon.semimajorAxis/10 + body.meanRadius, 0, 0]} size={[moon.meanRadius, 100, 100]} color={'white'} setBodyToGo={setBodyToGo} />
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
          <Canvas camera={{position:[0, 0, 1200000], far: 0x10000000}}>
              <Scene simpleBodies={simpleBodies} moons={moons} complexBodies={complexBodies} bodyToGo={bodyToGo} setBodyToGo={setBodyToGo}/>
          </Canvas>
          <Loader />
      </div>
  )
}