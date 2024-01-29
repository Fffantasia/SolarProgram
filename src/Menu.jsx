import React, { useRef, useState } from 'react'
import "./Menu.css";

function Menu({planets, asteroids, moons, setBodyToGo}){
    return(
        <div className="Menu">
            <div className='menu-inner'>
                <h2 className='planets-title'>Planets</h2>
                <ul className="planets-list">
                    {planets.map((planet) =>(
                        <li key={planet.englishName + "Item"} className={planet.englishName + "Item"} onClick={() => setBodyToGo(planet.englishName)}>{planet.englishName}</li>
                    ))}
                </ul>
                <h2 className='asteroids-title'>Asteroids</h2>
                <ul className="asteroids-list">
                    {asteroids.map((asteroid) =>(
                        <li key={asteroid.englishName + "Item"} className={asteroid.englishName + "Item"} onClick={() => setBodyToGo(asteroid.englishName)}>{asteroid.englishName}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Menu;