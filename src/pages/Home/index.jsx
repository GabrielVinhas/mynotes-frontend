import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { FiPlus } from 'react-icons/fi';

import { api } from '../../services/api'

import { Container, Brand, Menu, Search, Content, NewNote } from './styles'

import { Note } from '../../components/Note'
import { Input } from '../../components/Input'
import { Header } from '../../components/Header'
import { Section } from '../../components/Section'
import { ButtonText } from '../../components/ButtonText'


export function Home() {
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [search, setSearch] = useState("")
  const [notes, setNotes] = useState([])

  const navigate = useNavigate()

  function handleSelectedTag(tagName) {

    if(tagName === "all") {
      return setSelectedTags([])
    }



    const alreadySelected = selectedTags.includes(tagName)

    if(alreadySelected){
      const filtredTags = selectedTags.filter(tag => tag !== tagName)
      setSelectedTags(filtredTags)

    } else {
      setSelectedTags(prevState => [...prevState, tagName])
    }
  }

  function handleDetails(id) {
    navigate(`/details/${id}`)
  }

  useEffect(() => {
    async function fetchTags() {
      const response = await api.get('/tags')
      setTags(response.data)
    }

    fetchTags()
  }, [])

  useEffect(() => {
    async function fetchNotes() {
      const response = await api.get(`/notes?title=${search}&tags=${selectedTags}`)
      setNotes(response.data)
    }

    fetchNotes()
  }, [selectedTags, search])

  return(
    <Container>
      
      <Brand>
      <h1>My Notes 📖💖</h1>
      </Brand>

      <Header />

      <Menu>
        <li><ButtonText 
        title='Todos' 
        onClick={() => handleSelectedTag("all")}
        isActive={selectedTags.length === 0}
        /></li>
        {
          tags && tags.map(tag => (
            <li 
            key={String(tag.id)}>
              <ButtonText 
              title={tag.name} 
              onClick={() => handleSelectedTag(tag.name)}
              isActive={selectedTags.includes(tag.name)}
              /></li>
          ))
        }
      </Menu>

      <Search>
      <Input 
      placeholder='Pesquisar pelo título' 
      onChange={(e) => setSearch(e.target.value)}
      />
      </Search>

      <Content>
        <Section title='Minhas notas'>
          {
            notes.map(note => (
            <Note 
              key={String(note.id)}
              data={note}
              onClick={() => handleDetails(note.id)}
            />
            ))
          }
        </Section>
      </Content>

      <NewNote to='/new'>
        <FiPlus />
        Criar nota
      </NewNote>

    </Container>
  );
}