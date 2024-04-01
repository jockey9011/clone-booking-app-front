import { useContext, useState } from 'react';
import './login.css'
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const login = async (e) => {
    e.preventDefault();
    
    dispatch({ type: "LOGIN_START" });
    try {
      toast.loading("Cargando...")
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      toast.dismiss()
      toast.success("Bienvenid@ a AlojaColombia " + res.data.username, {duration: 2000, position: 'top-right'})
      
      setTimeout(() => { 
        toast.dismiss()
        navigate("/") }, 1500)
      
    } catch (error) {
      toast.dismiss()
      toast.error(`Error de acceso: ${error.response.data.message}`,
      {duration: 4000, position: 'top-right'})
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
    }
  }

  const register = async (e) => {
    e.preventDefault();
    
    dispatch({ type: "REGISTER_START" });
    try {
      toast.loading("Cargando...")
      const res = await axios.post("/auth/register", credentials);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
      toast.dismiss()
      toast.success("Registro exitoso", {duration: 2000, position: 'top-right'})
      
      setTimeout(() => { 
        toast.dismiss()
        navigate("/") }, 1500)
      
    } catch (error) {
      toast.dismiss()
      toast.error(`Error en el registro: ${error.response.data.message}`,
      {duration: 4000, position: 'top-right'})
      dispatch({ type: "REGISTER_FAILURE", payload: error.response.data });
    }
  }

  return (

    <div className="container-login">
      <div className="main">
        <input type="checkbox" id='label' aria-hidden="true" />
        <div className='login'>
          <label htmlFor="label">Iniciar Sesión</label>
         
            <input type="text" placeholder='Nombre de usuario' id="username" className='lInput'
              onKeyUp={(e) => e.key === "Enter" ? login(e) : "" }
              onChange={handleChange}
            />
            <input type="password" placeholder='Contraseña' id="password" className='lInput'
              onKeyUp={(e) => e.key === "Enter" ? login(e) : "" }
              onChange={handleChange}
            />

            <button className="lButton" onClick={login} disabled={loading}>Ingresar</button>
            {error && <span className="lFailure">{error.message}</span>}
          
        </div>

        <div className='register'>
          <label htmlFor="label">Registro</label>
          <input type="text" placeholder='Nombre de usuario' id="username" className='lInput'
            onChange={handleChange}
          />
          <input type="password" placeholder='Contraseña' id="password" className='lInput'
            onChange={handleChange}
          />
          <input type="email" placeholder='Correo electrónico' id="email" className='lInput'
            onChange={handleChange}
          />

          <button className="lButton" onClick={register} disabled={loading}>Registrar</button>
          {error && <span className="lFailure">{error.message}</span>}
        </div>

      </div>
      <Toaster />
    </div>
  )
}

export default Login
