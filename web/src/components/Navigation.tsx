import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { FaBook, FaPlus, FaSearch, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { ListNotesDocument, useAddNoteMutation, useListNotesQuery, useLogoutMutation, useMeQuery } from '../generated/graphql'
import { clearToken } from '../helper/auth'
import { debounceFn } from '../helper/debounce'
import { GENERICS, MIXINS } from './GlobalStyles'

export function Navigation() {
  const navigate = useNavigate()
  const { refetch } = useListNotesQuery()
  const [submitLogout, {client}] = useLogoutMutation()
  const { data } = useMeQuery()
  const [ submitAddNote ] = useAddNoteMutation()

  const [searchText, setSearchText] = useState("")

  const onLogoutHandler = async () => {
    try {
      await submitLogout()
      await client.resetStore()
      clearToken()
      navigate('/login', {replace: true})
    } catch (err) {
      console.log(err)
    }
  }

  const onAddNoteHandler = async () => {
    try {
      const note = await submitAddNote({ variables: {content: "Content", title: "Title"} })
      const listNotes = client.readQuery({ query: ListNotesDocument })
      client.writeQuery({
        query: ListNotesDocument,
        data: {
          listNotes: [...listNotes.listNotes, note.data?.addNote]
        }
      }) 
    } catch (err) {
      console.log(err)
    }
  }

  // We write the query so our ListNotes component can render the notes we get from the server
  const onSearchHandler = debounceFn( async () => {
    await refetch({ search: searchText}).then(({data: { listNotes }}) => {
      client.writeQuery({
        query: ListNotesDocument,
        data: {
          listNotes,
        }
      })
    })
  }, 1000)

  useEffect(() => {
    onSearchHandler()
  }, [searchText])

  return (
    <NavigationStyled>
      <div className='user-profile'>
        <div>{data?.me?.username.substring(0,1)}</div>
        {/* <img /> */}
        <span>{data?.me?.username}</span>
        <span onClick={onLogoutHandler}>
        <FaSignOutAlt />
        </span>
      </div>
      <div className='search-container'>
        <FaSearch />
        <input type='text' placeholder='Search' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </div>

      <div className="newnote-button" onClick={onAddNoteHandler}>
        <FaPlus />
        <span>New Note</span>
      </div>
      <ul className='nav-menu'>
        <li className=''>
          <FaBook />
          <span>All Notes</span>
        </li>
      </ul>
    </NavigationStyled>
  )
}

const NavigationStyled = styled.div`
  width: 100%;
  height: 100%;
  max-width: 300px;
  background-color: ${GENERICS.colorBlack};
  color: #ccc;

  .user-profile {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    align-items: center;
    padding: 20px;
    gap: 10px;

    > div:first-of-type {
      background-color: ${GENERICS.primaryColor};
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      ${MIXINS.va()}
    }

    >span:nth-of-type(1) { // No wrap on span that hold clients name
      white-space: nowrap;
    }
    > span:last-child {
      justify-self: flex-end;
      cursor: pointer;
      transition: 0.3s;
      padding: 5px;
      &:hover {
        color: red;
      }
    }
  }

  .search-container {
    ${MIXINS.va()}
    padding: 10px 20px;
    border-radius: 30px;
    background-color: ${GENERICS.colorBlackCalm}; 
    margin: 0 20px;
    margin-bottom: 14px;

    > input {
      background-color: transparent;
      color: white;
      border: none;
      outline: none;
      margin-left: 10px;
      font-size: 16px;
    }
  }

  .newnote-button {
    ${MIXINS.va("left")}
    border-radius: 30px;
    padding: 10px 20px;
    gap: 10px;
    color: white;
    cursor: pointer;
    margin: 0 20px;
    background-color: ${GENERICS.primaryColor};

    &:hover {
      background-color: ${GENERICS.primaryColorDark};
    }
  }

  .active {
    background-color: #444;
    color: white;
  }

  .nav-menu {
    margin-top: 20px;
    > li {
      padding: 10px 40px;
      gap: 10px;
      ${MIXINS.va("left")}
      cursor: pointer;
      &:hover {
        background-color: #333;
      }
    }
  }
`
