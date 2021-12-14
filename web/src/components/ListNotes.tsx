import styled from '@emotion/styled'
import { ListNotesDocument, Note, useDeleteNoteMutation, useListNotesQuery, useUpdateNoteMutation } from '../generated/graphql'
import { GENERICS, MIXINS } from './GlobalStyles'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FaSort, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa'
import {useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { stripHtml } from "string-strip-html";
import { debounceFn } from '../helper/debounce'
import { shortenText } from '../helper/shortenText'
dayjs.extend(relativeTime)

interface EditorProps {
  disabled: boolean;
}

type OrderByType = "ASC" | "DESC"

export function ListNotes() {
  const [noteContent, setNoteContent] = useState({
    title: '',
    content: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [orderBy, setOrderBy] = useState<OrderByType>("DESC")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const { data, refetch } = useListNotesQuery()

  const [submiteUpdateNote] = useUpdateNoteMutation()
  const [submitDeleteNote] = useDeleteNoteMutation()

  useEffect(() => {
    if(selectedNote) {
      setTimeout(() => {
        setIsSaving(true)
      }, 1500)
    }
    onUpdateNoteHandler();
  }, [noteContent])

  // Title takes in an event and sets the title of the note to the value of the event
  const onChangeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSaving(true)
    setNoteContent({...noteContent, title: e.target.value})
  }

  // Editor (React-Quill) takes in a string value, not an event
  const onChangeEditorHandler = (value: string) => {
    setIsSaving(true)
    setNoteContent(prevNote => ({...prevNote, content: value}))
  }

  const onUpdateNoteHandler = debounceFn(async () => {
    if(!selectedNote) return;
    try {
      await submiteUpdateNote({
        variables: {
          title: noteContent.title,
          content: noteContent.content,
          noteId: selectedNote.id,
        },
        update: (store, newNote) => {
          store.writeQuery({
            query: ListNotesDocument,
            data: {
              listNotes: data?.listNotes.map(note => {
                if(note.id === selectedNote.id) {
                  return newNote
                }
                return note
              })
            }
          })
        }
      })
      setIsSaving(false)
    } catch (err) {
      console.log(err)
    }
  })

  const onDeleteNoteHandler = (note: Note) => async () => {
    if(window.confirm("Are you sure?")) {
      try {
        await submitDeleteNote({
          variables: {
            noteId: note.id,
          },
          update: (store) => {
            store.writeQuery({
              query: ListNotesDocument,
              data: {
                listNotes: data?.listNotes.filter(n => n.id !== note.id)
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  const onSelectNoteHandler = (note: Note) => () => {
    setNoteContent({
      title: note.title,
      content: note.content,
    })
    setSelectedNote(note)
  }

  const onOrderByHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newOrderBy = orderBy === "ASC" ? "DESC" : "ASC"
    await refetch({ orderBy: newOrderBy })
    setOrderBy(newOrderBy)
  }

  return (
    <>
    <ListNoteStyled>
      <h2>My Notes</h2>
      <div className='note-filter'>
        <span>{data?.listNotes.length} notes</span>
        <div className='filters'>
          <span onClick={onOrderByHandler}>
            {orderBy === "DESC" ? <FaSortDown /> : <FaSortUp />}
          </span>
        </div>
      </div>
      <div className='list-notes'>
        {data?.listNotes.map((note) => (
          <div key={note.id} className={`note${selectedNote?.id === note.id ? " active" : ""}`} onClick={onSelectNoteHandler(note as any)}>
            <div className='note-details'>
              <h2 className='note-title'>{note.title || "Title"}</h2>
              <div>{shortenText(stripHtml(note.content).result) || "Content"}</div>
              <small>{dayjs(note.created_at).fromNow(true)} ago</small>
            </div>
            <div className='delete-btn' onClick={onDeleteNoteHandler(note as any)}>
              <FaTrash />
            </div>
          </div>
        ))}
      </div>
    </ListNoteStyled>
    <EditorContainer disabled={!selectedNote}>
      <input value={noteContent.title} disabled={!selectedNote} onChange={onChangeTitleHandler} placeholder='My Title' />
      {isSaving && <div className='saving-text'><small>Saving...</small></div>}
      <ReactQuill value={noteContent.content} readOnly={!selectedNote} onChange={onChangeEditorHandler} placeholder='Start writing a new note here...' />
    </EditorContainer>
    </>
  )
}

const ListNoteStyled = styled.div`
  height: 100%;
  width: 100%;
  max-width: 350px;
  color: ${GENERICS.colorBlackCalm};
  background-color: ${GENERICS.bgColor};
  display: flex;
  flex-direction: column;

  > h2 {
    font-weight: normal;
    padding: 20px;
  }

  .note-filter {
    ${MIXINS.va("space-between")}
    padding: 15px 20px;
    border-bottom: 1px solid #ccc;

    .filters span {
      cursor: pointer;
      padding: 3px;
      
    }
  }

  .list-notes {
    overflow-y: auto;
    height: 100%;
    .active {
      background-color: #fff;
    }
    .note {
      cursor: pointer;
      padding: 20px;
      border-bottom: ${GENERICS.border};
      color: ${GENERICS.colorGray};
      ${MIXINS.va("space-between")}
      &:hover {
        background-color: #eee;
        .delete-btn {
          visibility: visible;
        }
      }

      .note-details {
        > div {
          margin-bottom: 5px;
        }
        .note-title {
          color: ${GENERICS.colorBlackCalm};
          font-weight: bold;
        }
      }
      .delete-btn {
        visibility: hidden;
        cursor: pointer;
        padding: 5px;
        &:hover {
          transition: 0.3s;
          color: red;
        }
      }
    }
  } 
`

const EditorContainer = styled.div<EditorProps>`
  width: 100%;
  >input {
    border: none;
    outline: none;
    padding: 17px;
    font-size: 2em;
    width: 100%;

    &:disabled {
      background: transparent;
      cursor: not-allowed;
    }
  }

  .saving-text {
    padding: 0 18px;
    font-style: italic;
  }

  .ql-toolbar, .ql-container { // Overwrite Quill's default styles
    border: none;
  }

  .quill, .ql-container {
    font-size: 1.2em;
    height: 100%;
    cursor: ${(props: any) => props.disabled ? 'not-allowed' : 'unset'};
  }
  .ql-editor p {
    cursor: ${(props: any) => props.disabled ? 'not-allowed' : 'unset'};
  }
`