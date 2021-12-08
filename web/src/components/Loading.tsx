import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaSpinner } from "react-icons/fa";
import { GENERICS } from "./GlobalStyles";
import { Layout } from "./Layout";
import { Wrapper } from "./Wrapper";

export const Loading = () => {
  return (
    <Layout>
      <Wrapper center={true}>
        <SpinnerStyled>
          <FaSpinner />
        </SpinnerStyled>
      </Wrapper>
    </Layout>
  );
}

const Spinning = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg)
  }
`;

const SpinnerStyled = styled.span`
  font-size: 3em;
  color: ${GENERICS.primaryColor};
  animation: ${Spinning} 1s linear infinite;
`;