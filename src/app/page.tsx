'use client'

import Image from "next/image"
import styles from "./page.module.sass"
import { ChangeEvent, useEffect, useState } from "react"
import {getMovies} from '@/api/gets'
import Header from "./components/Header"
import Footer from "./components/Footer/Footer"

interface IFullInfo {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string 
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average?: number
  vote_count: number
}

export default function Home() {

  const [hanged, setHanged] = useState('./hangman_start.svg')
  const [disable, setDisable] = useState(false)
  const [life, setLife] = useState(5)
  const [info, setInfo] = useState<string[]>([])
  const [erros, setErros] = useState<string[]>([])
  const [fullInfo, setfullInfo] = useState<IFullInfo>({} as any)
  const [chosenMovie, setChosenMovie] = useState('')
  const [hidden, setHidden] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [waiting, setWaiting] = useState('')
  const [poster, setPoster] = useState('?')

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
      setHidden(updatedHidden)
  
      // Verifica se ainda há caracteres ocultos
      if (!updatedHidden.includes('__')) {
        const original = `Título Original: ${fullInfo.original_title || ''}`
        const av_vote = `Classificação: ${(Number(fullInfo.vote_average) || 0) * 10}%`
        setResult('Parabéns! Você venceu.')
        setPoster(`https://image.tmdb.org/t/p/w200${fullInfo?.poster_path || ''}`)
        setInfo([av_vote, original])
        setDisable(true)
      }
    } else {
      if (!erros.includes(tried)) {
        setErros([...erros, tried])
        setLife(life - 1)
        if (life === 1) {
          const original = `Título Original: ${fullInfo.original_title || ''}`
          const av_vote = `Classificação: ${(Number(fullInfo.vote_average) || 0) * 10}%`
          setResult(`O filme escolhido era: "${chosenMovie}".\nBoa sorte na próxima vida...`)
          setHanged('./hangman_dead.svg')
          setPoster(`https://image.tmdb.org/t/p/w200${fullInfo?.poster_path || ''}`)
          setInfo([av_vote, original])
          setDisable(true)
        }
      }
    }
  }
  

  async function play() {
    setWaiting('Aguardando resposta!')
    setHanged('./hangman_start.svg')
    setErros([])
    setInfo([])
    setDisable(false)
    setResult('')
    setLife(5)
    const tempMovies: any = await getMovies()
    setWaiting('')
    selectMovie(JSON.parse(tempMovies))
    
  }

  function selectMovie(temp: any) {
    const regex = /^[A-Za-z0-9\s.,;!?'"()\-]+$/
    let indice = undefined
  
    do {
      indice = Math.floor(Math.random() * 20)
    } while (!regex.test(temp.results[indice].title))
  
    setfullInfo(temp.results[indice])
    setPoster('?')
    setChosenMovie(temp.results[indice].title.toLowerCase())
    montagem()
  }

  function isAlpha(char: string) {
    return /^[a-zA-Z]+$/.test(char)
  }
  
  function isNumeric(char: string) {
    return /^[0-9]+$/.test(char)
  }

  function montagem() {
    const hiddenMovie = chosenMovie.split('').map(letra => {
      return letra === ' ' || !isAlpha(letra) && !isNumeric(letra) ? letra : '__'
    });
    setHidden(hiddenMovie)
  }

  useEffect(() => {
    if (chosenMovie) {
      montagem()
    }
  }, [chosenMovie])
  
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
      <div className={styles.hanger}>
        <Image 
          className={styles.hangman} 
          width={200}
          height={200}
          src={hanged}
          alt="hangman"
          priority
        />
        <div className={styles.info}>
          <div className={styles.poster}>
            {poster !== "?" ? <Image   
              width={100}
              height={100}
              src={poster}
              alt='poster'
              priority
            /> : poster}
          </div>
          <div>
            <p>{info[0]}</p>
            <p>{info[1]}</p>
            
          </div>
        </div>
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
              <span key={index}>{el} </span>
            ))}
          <span>)</span>
        </div>
        <div>{waiting}</div>
        <label>Digite uma letra: </label>
        <input className={styles.try} onChange={e => handleTry(e)} disabled={disable} />
        <button id={styles.replay} onClick={() => play()}>Play!</button>
        <div className={styles.result}>{result}</div>
      </div>
      </main>
      <Footer />
    </div>
  )
}
