import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GENERICS } from "../components/GlobalStyles";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { isAuthenticated, saveToken } from "../helper/auth";

export default function Login() {
  const [submitLogin, { error, loading }] = useLoginMutation()

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onSubmitHandler = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try { 
      const data = await submitLogin({
        variables: {
          ...form,
        },
      });
      saveToken(data.data?.login.access_token!); // Save token to local storage 
      navigate("/", { replace: true });
    } catch(err){
      console.log(err)
    }
  }

  const onChangeHandler = 
    (name: string) => 
      ({ target }: ChangeEvent<HTMLInputElement>) => 
        setForm({...form, [name]: target.value})
      
  if(isAuthenticated()) {
    return <Navigate to='/' />
  }

  return (
    <Wrapper center={true}>
      <FormWrapper className='login-container'>
        <div className='left-side'>
          <img src="https://ecurater.com/wp-content/uploads/2020/10/login1.png" alt="Login" />
        </div>
        <div className='right-side'>
          <div>
            <img src='https://www.freeiconspng.com/uploads/evernote-icon-2.png' alt='Evernote Logo' />
            <h2>Evernote Clone</h2>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div>
              <input placeholder='Email' value={form.email}  onChange={onChangeHandler("email")}  />
            </div>

            <div>
              <input type='password' placeholder='Password' value={form.password} onChange={onChangeHandler("password")} />
            </div>

            {error && error.graphQLErrors.map(({message}, i) => 
              <div key={i}><small className='error-message'>{message}</small></div>
            )}

            <div>
              <button disabled={loading} type='submit'>{loading ? "..." : "Submit"}</button>
            </div>
            <p>
              Don't have an account? Signup&nbsp;
              <span><Link to='/signup'>here</Link></span>
            </p>
          </form>
        </div>
      </FormWrapper>
    </Wrapper>
  )
}

const FormWrapper = styled("div")`
  display: flex;
  align-items: center;
  border: ${GENERICS.border};
  border-radius: 5px;
  padding: 50px;
  user-select: none;
  gap: 20px;

  > div {
    flex: 0.5;
  }

  .left-side {
    img {
      width: 200px;
    }
  }

  .right-side {
    > div:first-of-type {
      text-align: center;
      img {
        width: 50px;
        border-radius: 10px;
      }
      margin-bottom: 20px;
    }

    form {
      div {
        margin-bottom: 10px;
        input {
          border: 2px solid gray;
          border-color: #ccc;
          border-radius: 10px;
          padding: 10px 20px;
          outline: none;
          transition: 0.4s;

          &:focus {
            border-color: blue;
          }
        }

        button {
          width: 100%;
          color: white;
          background-color: ${GENERICS.primaryColor};
          border-radius: 10px;
          padding: 8px 20px;
        }
        small.error-message {
          color: red;
        }
      }
      p {
        font-size: 12px;
        a {
          color: ${GENERICS.primaryColor}
        }
      }
    }
  }
`