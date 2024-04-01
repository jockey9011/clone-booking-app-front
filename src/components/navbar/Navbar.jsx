import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.css"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/">
          <span className="logo">AlojaColombia</span>
        </Link>
        {user ? (
          <div className="navItems">
            <span>{user.username}</span>
            <Link to="/reservations" className="navButton">Mis Reservas</Link>
            <button onClick={handleLogout} className="navButton">Cerrar Sesión</button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/login" className="navButton">Iniciar Sesión</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

