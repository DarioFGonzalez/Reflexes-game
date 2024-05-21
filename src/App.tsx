import { useEffect, useState } from "react";
import React, { useRef } from "react";
import enemy_ship from '../assets/enemy_ship1.png';
import explocion from '../assets/explotion.gif';
import Style from './App.module.css';

function App()
{
  const [ mSegs, setMsegs] = useState( 0 );
  const [ segs, setSegs ] = useState( 0 );
  const [ intervaloId, setIntervaloId ] = useState( 0 );
  const [ numberIntervalId, setNumberIntervalId ] = useState( 0 );
  const [ show, setShow ] = useState( false );
  const [ name, setName ] = useState( '' );
  const [ explotion, setExplotion ] = useState( false );
  const [ highScore, setHighScore ] = useState(
    [
      { name: '', score: 10 },
      { name: '', score: 10 },
      { name: '', score: 10 },
      { name: '', score: 10 },
      { name: '', score: 10 },
    ] );
  const [ coordinates, setCoordinates ] = useState(
    { transition: "all 0.35s ease", height: 50, width: 50, top: 100, left: 100, position: "relative", transform: "rotate(45deg)" } )
    
    useEffect( () => // Checks if there is a highscore localStorage value, if there isn't- it starts it up.
    {
      let local = localStorage.getItem('highscore')

      local===null && localStorage.setItem('highscore', JSON.stringify(
        [
          { name: randomName(), score: 10 },
          { name: randomName(), score: 10 },
          { name: randomName(), score: 10 },
          { name: randomName(), score: 10 },
          { name: randomName(), score: 10 },
        ] ) );

        local!=null && setHighScore( JSON.parse( local ) );
    },[]);
    
    useEffect( () => // Once timer hits 10 secs, it automatically stops it.
    {
      segs==10 && pause();
    },[segs])

    const ref = useRef<HTMLDivElement>(null);
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.detail === 2) { // Check for double click
            event.preventDefault(); // Prevent default behavior
            return;
        }

        // Handle single click logic here
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent text selection on mousedown
    };
    
  const startGame = () =>
  {
    setShow(true);
    setMsegs( 0 );
    setSegs( 0 );
    let ms = 0;
    let s = 0;
    let intervalo = setInterval( () =>
    {
      if( ms == 99 )
      {
        ms=0;
        s++;
        setMsegs( ms );
        setSegs( s );
      }
      else
      {
        ms++;
        setMsegs( ms );
      }
    }, 10);

    position();

    setIntervaloId( intervalo );
  }

  const pause = () =>
  {
    victory();
    let puntuacion = segs + mSegs/100;
    let toCheck = { name: name, score: puntuacion}
    let aux = {name: '', score: 0};

    for(let i=0; i<5; i++)
    {
      let scores = highScore;
      if( toCheck.score < scores[i].score || toCheck.score == scores[i].score )
        {
          aux = {name: scores[i].name, score: scores[i].score};
          scores[i] = toCheck;
          toCheck = aux;
        }
        setHighScore( scores );
        localStorage.setItem( 'highscore', JSON.stringify( scores ) );
    }
    
    clearInterval( intervaloId );
    clearInterval( numberIntervalId );
  }

  const position = () => // Controla la posición (aleatoria) del botón.
  {
    let numberInterval = setInterval( () =>
    {
      let newTop = Math.floor( Math.random() * ( 249 - 3 + 1) ) + 3;
      let newLeft = Math.floor( Math.random() * ( 103 - (-103) + 1 ) ) + (-103);
      let newRotation = 0;
      if( newTop<125 && newLeft<0 || newTop>=125 && newLeft>=0 )
      {
        newRotation = 0;
      }
      else
      {
        newRotation = 90;
      }
      // let newRotation = Math.floor( Math.random() * ( 90 - 0 + 1 ) ) + 0;
            
      setCoordinates( { transition: "all 0.35s ease", height: 50, width: 50, top: newTop, left: newLeft, position: "relative", transform: `rotate(${newRotation}deg)` } )
    }, 350)

    setNumberIntervalId( numberInterval );
  }

  const randomName = () =>
  {
    let names =
    [ 'Freedon', 'Vitiate', 'Marka', 'Enzo', 'Plagueis', 'Bane', 'Revan', 'Exar', 'Sidious' , 'Vader'];

    return names[ Math.floor( Math.random() * ( 9 - 0 + 1 ) + 0 ) ];
  }

  const victory = () =>
  {
    setExplotion(true);

    setTimeout( () =>
    {
      setShow( false );
      setExplotion( false);
    }, 750)
  };
  
  return (
    <main className={Style.general}>

      <header className={Style.header}>
        <label className={ Style.white }> JUGADOR: </label>
        {!show && <input className={ Style.centrado } onChange={(e)=>setName(e.target.value.toUpperCase())} value={name}/>}
        {show && <input value={name} disabled/>}
      </header>

      <div>
        <h1 className={Style.white}> Timer: {segs}.{String(mSegs).padStart(2, '0')} </h1>
      </div>

      <article>

        <div className={ show ? Style.space : Style.background } ref={ref} onDoubleClick={handleClick} onMouseDown={handleMouseDown}>
          {(show && !explotion)&& <img src={enemy_ship} alt='Nave enemiga' style={ coordinates } onClick={pause} /> }
          {(show && explotion) && <img src={explocion} alt='Nave enemiga explotando' style={ coordinates } />}
          {(!show && name=='') && <button style={ { color: "GrayText", top: 125, left: 0, position: "relative" } } onClick={()=>alert('Escriba su nombre')} > Jugar </button>}
          {(!show && name!='') && <button style={ { top: 125, left: 0, position: "relative" } } onClick={startGame}> Jugar </button>}
        </div>


      </article>
      
      <footer>
        <table className={Style.white}>

          <thead >
            <tr>
              <th> Puesto - </th>
              <th> - Nombre - </th>
              <th> - Segundos </th>
            </tr>
          </thead>

          <tbody>
            {highScore.length>0 && highScore.map( (item, y) => (
              <tr key={y}>
                <td> {y+1}° </td>
                <td> {item.name} </td>
                <td> {item.score} </td>
              </tr>
            ))}
          </tbody>

        </table>
      </footer>
    </main>
  );
}

export default App;
