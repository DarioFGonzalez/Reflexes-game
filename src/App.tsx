import { useEffect, useState } from "react";
import React, { useRef } from "react";
import Style from './App.module.css';

function App()
{
  const [ mSegs, setMsegs] = useState( 0 );
  const [ segs, setSegs ] = useState( 0 );
  const [ intervaloId, setIntervaloId ] = useState( 0 );
  const [ numberIntervalId, setNumberIntervalId ] = useState( 0 );
  const [ show, setShow ] = useState( false );
  const [ name, setName ] = useState( '' );
  const [ highScore, setHighScore ] = useState(
    [
      { name: '', score: 10 },
      { name: '', score: 10 },
      { name: '', score: 10 },
      { name: '', score: 10 },
      { name: '', score: 10 },
    ] );
  const [ coordinates, setCoordinates ] = useState(
    { backgroundColor: 'red', color: "blue", top: 100, left: 100, position: "relative" } )
    
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
    setShow(false);
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
      setCoordinates( { backgroundColor: 'red', color: "blue", top: newTop, left: newLeft, position: "relative" } )
    }, 275)

    setNumberIntervalId( numberInterval );
  }

  const randomName = () =>
  {
    let names =
    [ 'Freedon', 'Vitiate', 'Marka', 'Enzo', 'Plagueis', 'Bane', 'Revan', 'Exar', 'Sidious' , 'Vader'];

    return names[ Math.floor( Math.random() * ( 9 - 0 + 1 ) + 0 ) ];
  }
  
  return (
    <main >

      <header className={Style.header}>
        <h1> Timer: {segs}.{String(mSegs).padStart(2, '0')} </h1>
      </header>

      <div>
        <label> JUGADOR: </label>
        {!show && <input onChange={(e)=>setName(e.target.value.toUpperCase())} value={name}/>}
        {show && <input value={name} disabled/>}
      </div>

      <article>

        <div className={ Style.contenedor } ref={ref} onDoubleClick={handleClick} onMouseDown={handleMouseDown}>
          {show && <button style={ coordinates } onClick={pause}> HOLA </button>}
          {(!show && name=='') && <button style={ { color: "GrayText", top: 125, left: 0, position: "relative" } } onClick={()=>alert('Escriba su nombre')} > Jugar </button>}
          {(!show && name!='') && <button style={ { top: 125, left: 0, position: "relative" } } onClick={startGame}> Jugar </button>}
        </div>


      </article>
      
      <footer>
        <table>

          <thead>
            <tr>
              <th> Nombre </th>
              <th> Puntos </th>
            </tr>
          </thead>

          <tbody>
            {highScore.length>0 && highScore.map( (item, y) => (
              <tr key={y}>
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
