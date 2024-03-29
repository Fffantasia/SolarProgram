import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SolarSystem from './Boxes.jsx'
import Menu from './Menu.jsx'
import './Data.css'

function Data(){
    const path = 'https://api.le-systeme-solaire.net/rest/bodies/';
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [complexBodies, setComplexBodies] = useState([]);
    const [moons, setMoons] = useState([]);
    const [simpleBodies, setSimpleBodies] = useState([]);
    const [planets, setPlanets] = useState([]);
    const [asteroids, setAsteroids] = useState([]);
    const [bodyToGo, setBodyToGo] = useState(null);
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        const fetchData = async() =>{
        await axios
            .get(path)
            .then((response) => {
                setData(response.data.bodies);
            })
            .catch(error => console.log(error));
        }
        fetchData();
    }, [path])

    useEffect(()=>{
        const dataFilter = async() => {
            try{
                const filterComplex = (body) => body.moons
                const complexBodies = data.filter(filterComplex);
                setComplexBodies((prev) => [
                    ...prev,
                    ...complexBodies,
                ]);
                const filterMoon = (body) => body.aroundPlanet;
                const moons = data.filter(filterMoon);
                setMoons((prev) => [
                    ...prev,
                    ...moons,
                ]);
                const filterSimple = (body) => body.moons == null && body.aroundPlanet == null;
                const simpleBodies = data.filter(filterSimple);
                setSimpleBodies((prev) => [
                    ...prev,
                    ...simpleBodies,
                ]);
                const filterPlanet = (body) => body.isPlanet;
                const planets = data.filter(filterPlanet);
                setPlanets((prev) => [
                    ...prev,
                    ...planets,
                ]);
                const filterAsteroids = (body) => body.isPlanet == false && body.aroundPlanet == null;
                const asteroids = data.filter(filterAsteroids);
                setAsteroids((prev) => [
                    ...prev,
                    ...asteroids,
                ]);
                setIsLoading(false);
            }catch(error){
                console.log("Error al filtrar");
            }
            
        }
        dataFilter();
    }, [data])

    if(isLoading) {
        return <></>;
    }
    /*console.log(complexBodies);
    console.log(moons)
    console.log(simpleBodies);
    console.log(planets);
    console.log(asteroids);*/

    function keyDownHandler(e){
        console.log("hola")
    }
        window.addEventListener('keydown', function(event) {
            if(event.repeat){event.preventDefault()}
            console.log("Flecha ocultar")
            if(event.key == "j"){
                if(opened){
                    setOpened(!opened)
                    setTimeout(() => {
                        if(document.getElementById("arrow").style.display == "none"){
                            document.getElementById("arrow").style.display = "flex"
                        }else document.getElementById("arrow").style.display = "none"
                    }, 450);
                }else{
                    if(document.getElementById("arrow").style.display == "none"){
                        document.getElementById("arrow").style.display = "flex"
                    }else document.getElementById("arrow").style.display = "none"
                } 
            }
        });//onKeyDown={(e) => console.log(e)}
    return(
        <div className='Data'>
            <SolarSystem simpleBodies={simpleBodies} moons={moons} complexBodies={complexBodies} setBodyToGo={setBodyToGo} bodyToGo={bodyToGo}/>
            <div id="arrow" className="arrow" onClick={() => setOpened(!opened)} style={opened == true ? {"right": "15%"} : {"right": "0"}}>{opened == true ? <i className="arrow-right"></i> : <i className="arrow-left"></i>}</div>
            <Menu planets={planets} asteroids={asteroids} moons={moons} setBodyToGo={setBodyToGo} opened={opened}/>
        </div>
    )
}

export default Data;