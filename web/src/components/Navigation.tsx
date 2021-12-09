import styled from '@emotion/styled'
import { FaBook, FaPlus, FaSearch, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { useLogoutMutation } from '../generated/graphql'
import { clearToken } from '../helper/auth'
import { GENERICS, MIXINS } from './GlobalStyles'

export function Navigation() {
  const navigate = useNavigate()
  const [submitLogout, {client}] = useLogoutMutation()

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

  return (
    <NavigationStyled>
      <div className='user-profile'>
        <div>ff</div>
        {/* <img /> */}
        <span>Name Doe</span>
        <span onClick={onLogoutHandler}>
        <FaSignOutAlt />
        </span>
      </div>
      <div className='search-container'>
        <FaSearch />
        <input type='text' placeholder='Search' />
      </div>

      <div className="newnote-button">
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

    >span:nth-of-type(2) {
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
