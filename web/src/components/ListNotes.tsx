import styled from '@emotion/styled'
import { useListNotesQuery } from '../generated/graphql'
import { GENERICS, MIXINS } from './GlobalStyles'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FaSort } from 'react-icons/fa'
dayjs.extend(relativeTime)

export function ListNotes() {
  const { data } = useListNotesQuery()
  return (
    <ListNoteStyled>
      <h2>My Notes</h2>
      <div className='note-filter'>
        <span>{data?.listNotes.length}</span>
        <div className='filters'><span><FaSort /></span></div>
      </div>
      <div className='list-notes'>
        {data?.listNotes.map((note, i) => (
          <div className={`note${i === 1 ? " active" : ""}`}>
            <div>
              <h2>{note.title}</h2>
              <div>{note.content}</div>
              <small>{dayjs(note.created_at).fromNow(true)} ago</small>
            </div>
          </div>
        ))}
      </div>
    </ListNoteStyled>
  )
}

const ListNoteStyled = styled.div`
  height: 100%;
  width: 100%;
  max-width: 350px;
  color: ${GENERICS.colorBlackCalm};
  background-color: ${GENERICS.bgColor};

  > h2 {
    font-weight: normal;
    padding: 20px;
  }

  .note-filter {
    ${MIXINS.va("space-between")}
    padding: 15px 20px;
    border-bottom: 1px solid #ccc;
  }

  .list-notes {
    .active {
      background-color: #fff;
    }
    .note {
      cursor: pointer;
      padding: 20px;
      border-bottom: ${GENERICS.border};
      color: ${GENERICS.colorGray};

      &:hover {
        background-color: #eee;
      }
      > div {
        margin-bottom: 5px;
      }

      .note-title {
        color: ${GENERICS.colorBlackCalm};
        font-weight: bold;
      }
    }
  } 
`