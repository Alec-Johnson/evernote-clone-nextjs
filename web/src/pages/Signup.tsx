import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GENERICS } from "../components/GlobalStyles";
import { Wrapper } from "../components/Wrapper";
import { useSignupMutation } from "../generated/graphql";

type FormData = {
  email: string,
  password: string,
}

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<FormData>()

  const navigate = useNavigate()

  const [submitSignup, { error, loading }] = useSignupMutation();

  const onSubmitHandler = async (data: FormData) => {
    try { 
      await submitSignup({
        variables: data,
      });
      navigate("/", { replace: true });
      alert("Signup successful!");
    } catch(err){
      console.log(err)
    }
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
              <input placeholder='Email' {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  }
                })}
              />
              {errors.email && <p className="text-error">{errors.email.message}</p>}
            </div>

            <div>
              <input type='password' placeholder='Password' {...register("password", {
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
              <button disabled={isSubmitting ||loading} type='submit'>{loading ? "..." : "Sign up for free"}</button>
            </div>
            <p>
              Already have an account? Login&nbsp;
              <span><Link to='/login'>here</Link></span>
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