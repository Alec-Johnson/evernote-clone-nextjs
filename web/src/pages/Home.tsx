import { ListNotes } from "../components/ListNotes";
import { Navigation } from "../components/Navigation";
import { Wrapper } from "../components/Wrapper";
import styled from '@emotion/styled'
import { isAuthenticated } from "../helper/auth";
import { Navigate } from "react-router-dom";

export default function Home() {
  if(!isAuthenticated()) {
    return <Navigate to="/login" />
  }
  return (
    <HomeStyled>
      <Navigation />
      <ListNotes />
    </HomeStyled>
  )
}

const HomeStyled = styled(Wrapper)`
  display: flex;
`