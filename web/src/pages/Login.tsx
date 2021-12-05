import { ChangeEvent, FormEvent, useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSubmitHandler = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log(form);
    
  }

  const onChangeHandler = 
    (name: string) => 
      ({target}: ChangeEvent<HTMLInputElement>) => 
        setForm({...form, [name]: target.value})
      

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmitHandler}>
        <div>
          <label>Email</label>
          <input placeholder='Email' value={form.email}  onChange={onChangeHandler("email")}  />
        </div>
        
        <div>
          <label>Password</label>
          <input type='password' placeholder='Password' value={form.password} onChange={onChangeHandler("password")} />
        </div>

        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  )
}

