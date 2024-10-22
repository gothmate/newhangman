'use client'

import Image from "next/image"
import styles from "./page.module.sass"
import { ChangeEvent, useEffect, useState } from "react"
import {getMovies} from '@/api/gets'
import Header from "./components/Header"
import Footer from "./components/Footer/Footer"

export default function Home() {

  const [selections, setSelections] = useState([] as any)
  const [hanged, setHanged] = useState('./hangman_start.svg')
  const [life, setLife] = useState(6)
  const [erros, setErros] = useState([])
  const [chosenMovie, setChosenMovie] = useState('')
  const [hidden, setHidden] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [tries, setTries] = useState<string[]>([])

  function handleTry(e: ChangeEvent<HTMLInputElement>) {
    
  }

  async function play() {
    console.log('Clicado!')
    const tempMovies: any = await getMovies()
    setSelections(JSON.parse(tempMovies))
    selectMovie(JSON.parse(tempMovies))
    montagem()
  }

  function selectMovie(temp: any) {
    const regex = /^[A-Za-z0-9\s.,;!?'"()\-]+$/

    let indice = Math.floor(Math.random() * 20)
    console.log("FORA:", indice)
    while(true) {
      if(!regex.test(temp.results[indice].title)) {
        indice = Math.floor(Math.random() * 20)
        console.log("filme:", temp.results[indice].title)
        console.log("Dentro:", indice)
      } else {
        console.log("Saindo", indice)
        break
      }
    }
    setChosenMovie(temp.results[indice].title.toLowerCase())
    console.log("SECRET:", chosenMovie)
  }

  function isAlpha(char: string) {
    return /^[a-zA-Z]+$/.test(char)
  }
  
  function isNumeric(char: string) {
    return /^[0-9]+$/.test(char)
  }

  function montagem() {
    setHanged('./hangman_start.svg')
    setLife(6)
    let hiddenMovie = []

    for(let i = 0; i < chosenMovie.length; i++) {
      const letra = chosenMovie[i]

      if(letra === ' ') {
        hiddenMovie.push(letra)
      } else if (!isAlpha(letra) && !isNumeric(letra)) {
        hiddenMovie.push(letra);
      } else {
        hiddenMovie.push('__');
      }
    }
    if (!hiddenMovie.includes('__')) {
      setResult('Parabéns! Você venceu.')
    } 
    if(!hiddenMovie.includes('__') && life === 0) {
      setHanged('./hangman_dead.svg')
    }
    else {
      setResult('')
    }

    setHidden(hiddenMovie)
  }
  
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
      <div className={styles.hanger}>
        <Image 
          className={styles.hangman} 
          width={300}
          height={300}
          src={hanged}
          alt="hangman"
          priority
        />
      </div>
      <div className={styles.container}>
        <ul id="ul">
          {hidden.map((el, index) => (
            <li key={index}>{el}</li>
          ))}
        </ul>
        <div className={styles.letrasErradas}></div>
        <label>Digite uma letra: </label>
        <input className={styles.try} onChange={e => handleTry(e)} />
        <button id={styles.replay} onClick={() => play()}>Play!</button>
        <div className={styles.result}>{result}</div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
