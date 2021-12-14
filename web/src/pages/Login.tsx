import styled from "@emotion/styled";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GENERICS } from "../components/GlobalStyles";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { isAuthenticated, saveToken } from "../helper/auth";
import { useForm } from 'react-hook-form'

type FormData = {
  email: string,
  password: string,
}

export default function Login() {
  const [submitLogin, { error, loading }] = useLoginMutation()

  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<FormData>()
  
  const navigate = useNavigate();

  const onSubmitHandler = async (data: FormData) => {
    try {
      const res = await submitLogin({
        variables: data,
      });
      saveToken(res.data?.login.access_token!); // Save token to local storage 
      navigate("/", { replace: true });
    } catch(err){
      console.log(err)
    }
  }

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
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div>
              <input placeholder='Email' type="email" {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && <p className="text-error">{errors.email.message}</p>}
            </div>

            <div>
              <input placeholder='Password' type="password" {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  }
                })}
              />
              {errors.password && <p className="text-error">{errors.password.message}</p>}
            </div>

            {error && error.graphQLErrors.map(({message}, i) => 
              <div key={i}><small className='error-message'>{message}</small></div>
            )}

            <div>
              <button disabled={isSubmitting || loading} type='submit'>{loading ? "..." : "Submit"}</button>
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
      .text-error {
        padding: 5px 0;
        color: red;
      }
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

          &:disabled {
            background-color: #ccc;
          }
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