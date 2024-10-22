'use server'

import dotenv from 'dotenv'
dotenv.config()

export async function getMovies() {
    try {
        const page = Math.floor(Math.random() * 500) + 1
        const url = `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`
        const auth = process.env.TMDBAUTH
        if(!auth) {
            throw new Error("A chave de autorização não foi encontrada no arquivo .env")
        }
        let movies
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: auth
            }
        }

        await fetch(url, options)
            .then(res => res.json())
            .then(json => {
                movies = json
            })
            .catch(err => console.error('error:', err))

        return JSON.stringify(movies)

    } catch(err) {
        console.log("Erro: ", err)
    }
}