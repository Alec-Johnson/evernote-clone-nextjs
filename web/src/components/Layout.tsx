import styled from '@emotion/styled'
import React from 'react'


export const Layout = ({ children }: {children: React.ReactNode}) => ( <LayoutStyled>{children}</LayoutStyled>)

const LayoutStyled = styled.div`
  width: 100%;
  height: 100vh;
`
