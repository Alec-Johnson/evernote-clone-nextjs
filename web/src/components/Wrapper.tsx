import styled from "@emotion/styled"
import { MIXINS } from "./GlobalStyles"

type Props = {
  center?: boolean,
  backgroundColor?: string,
}

export const Wrapper = ({ children, ...props }: any) => <WrapperStyled {...props}>{children}</WrapperStyled>

const WrapperStyled = styled.div<Props>`
  height: 100%;
  width: 100%;
  overflow-y: hidden;

  ${(props) => (props.center ? MIXINS.va() : '')}

  background-color: ${(props) => props.backgroundColor ?  props.backgroundColor : `unset;`}
`