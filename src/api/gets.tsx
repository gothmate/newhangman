'use server'

import dotenv from 'dotenv'

interface IMovie {
    adult: Boolean
    backdrop_path: String
    genre_ids: Number[]
    id: Number
    original_language: String
    original_title: String
    overview: String
    popularity: Number
    poster_path: String
    release_date: String
    title: String
    video: Boolean
    vote_average: Number
    vote_count: Number
}

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