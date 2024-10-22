'use client'

import Image from "next/image"
import styles from "./page.module.sass"
import { ChangeEvent, useEffect, useState } from "react"
import {getMovies} from '@/api/gets'
import Header from "./components/Header"
import Footer from "./components/Footer/Footer"

export default function Home() {

  const [hanged, setHanged] = useState('./hangman_start.svg')
  const [life, setLife] = useState(5)
  const [erros, setErros] = useState<string[]>([])
  const [chosenMovie, setChosenMovie] = useState('')
  const [hidden, setHidden] = useState<string[]>([])
  const [result, setResult] = useState('')

  function handleTry(e: ChangeEvent<HTMLInputElement>) {
    const tried = e.target.value.toLowerCase()
    checkTry(tried)
    e.target.value = ''
  }

  function checkTry(tried: string) {
    let correctGuess = false;
    const updatedHidden = [...hidden]

    for (let i = 0; i < chosenMovie.length; i++) {
      if (tried === chosenMovie[i]) {
        correctGuess = true
        updatedHidden[i] = tried
      }
    }

    if (correctGuess) {
      setHidden(updatedHidden);  // Atualiza o estado com os traços substituídos
      if (!updatedHidden.includes('__')) {
        setResult('Parabéns! Você venceu.')
      }
    } else {
      if (!erros.includes(tried)) {
        setErros([...erros, tried])
        setLife(life - 1)
        if (life === 1) {
          setResult(`O filme escolhido era: "${chosenMovie}".\nBoa sorte na próxima vida...`)
          setHanged('./hangman_dead.svg')
        }
      }
    }
  }

  async function play() {
    console.log('Aguardando resposta!')
    setHanged('./hangman_start.svg')
    setErros([])
    setResult('')
    setLife(5)
    const tempMovies: any = await getMovies()
    selectMovie(JSON.parse(tempMovies))
  }

  function selectMovie(temp: any) {
    const regex = /^[A-Za-z0-9\s.,;!?'"()\-]+$/
    let indice = undefined
  
    do {
      indice = Math.floor(Math.random() * 20)
    } while (!regex.test(temp.results[indice].title))
  
    setChosenMovie(temp.results[indice].title.toLowerCase())
  }

  function isAlpha(char: string) {
    return /^[a-zA-Z]+$/.test(char)
  }
  
  function isNumeric(char: string) {
    return /^[0-9]+$/.test(char)
  }

  function montagem() {
    const hiddenMovie = chosenMovie.split('').map(letra => {
      if (letra === ' ' || !isAlpha(letra) && !isNumeric(letra)) {
        return letra;
      }
      return '__';
    });

    setHidden(hiddenMovie);
  }

  useEffect(() => {
    if (chosenMovie) {
      montagem()
    }
    console.log(chosenMovie)
  }, [chosenMovie])
  
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
            <li key={index}>{el} </li>
          ))}
        </ul>
        <div className={styles.letrasErradas}>
          <span>Erros: (</span>
            {erros.map((el: string, index: number) => (
              <span key={index}>{el}, </span>
            ))}
          <span>)</span>
        </div>
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
