import { ListNotes } from "../components/ListNotes";
import { Navigation } from "../components/Navigation";
import { Wrapper } from "../components/Wrapper";
import styled from '@emotion/styled'

export default function Home() {
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