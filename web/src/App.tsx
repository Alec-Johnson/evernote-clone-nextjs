
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { GlobalStyles } from './components/GlobalStyles';
import { Layout } from './components/Layout';
import { Loading } from "./components/Loading";
import { isAuthenticated, usePrepareApp } from "./helper/auth";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const { isLoading } = usePrepareApp();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Layout>
        <Routes>
          <Route path='/' element={<RequireAuth><Home /></RequireAuth>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

const RequireAuth: React.FC<{children: JSX.Element}> = ({ children }) => {
  const auth = isAuthenticated(); // determine if authorized by checking local storage for token

  // If authorized, return and render the child elements
  // If not, return element that will navigate to login page
  return auth ? children : <Navigate to="/login" replace />;
}
export default App;
