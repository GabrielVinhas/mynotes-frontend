import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://mynotes-api-gqbh.onrender.com/'
})
