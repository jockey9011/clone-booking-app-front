import React, { useContext, useState, useEffect } from 'react';
import "./reserve.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import useFetch from '../../Hooks/useFetch';
import { SearchContext } from '../../context/SearchContext';
import { AuthContext } from '../../context/AuthContext'; // Importa el contexto de autenticación
import axios from "axios";


axios.defaults.baseURL = 'https://clone-booking-app-1.onrender.com/api';
axios.defaults.withCredentials = true; // Habilita el envío de cookies en las peticiones

const Reserve = ({ setOpen, hotelId }) => {
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext); // Obtiene el estado del usuario del contexto de autenticación
  const [allDates, setAllDates] = useState([]);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (dates.length > 0) {
      const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];
        let currentDate = start;
        while (currentDate <= end) {
          dates.push(currentDate.getTime());
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      };
      const datesInRange = getDatesInRange(dates[0].startDate, dates[0].endDate);
      console.log("Dates in range:", datesInRange);
      setAllDates(datesInRange);
    }
  }, [dates]);

  const isAvailable = (roomNumbers) => {
    if (!roomNumbers || !roomNumbers.unavailablesDates) {
      return true;
    }
    
    const isFound = roomNumbers.unavailablesDates.some((date) =>
      allDates.includes(new Date(date).getTime())
    );
    return !isFound;
  };
  
  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    if (!dates || !dates[0] || !dates[0].startDate || !dates[0].endDate) {
      setErrorText('No se ha seleccionado ninguna fecha.');
      return;
    }
  
    if (!user || !user._id) {
      setErrorText('El usuario no está autenticado.');
      return;
    }
  
    try {
      const requestData = {
        userId: user._id, // Asegúrate de que user._id sea válido
        roomId: selectedRooms[0],
        hotelId: hotelId,
        checkIn: new Date(dates[0].startDate),
        checkOut: new Date(dates[0].endDate),
      };
      console.log('Datos de la reserva a enviar:', requestData);
  
      const response = await axios.post("/bookings", requestData, {
        // Configuración para enviar la cookie de autenticación
        withCredentials: true
      });
      console.log("Reserva realizada con éxito:", response.data);
      setOpen(false); // Cierra la ventana modal después de hacer la reserva
      // Aquí puedes realizar otras acciones, como mostrar un mensaje de éxito o redirigir al usuario a otra página
    } catch (error) {
      console.error("Error al realizar la reserva:", error.message);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
    }
  };
  
  

  return (
    <div className='reserve'>
      <div className='rContainer'>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className='rClose'
          onClick={() => setOpen(false)}
        />
        <span>Seleccione habitaciones:</span>
        {data && data.map && (
          data.map((item) => (
            <div className='rItem' key={item._id}>
              <div className='rItemInfo'>
                <div className='rTitle'>{item.title}</div>
                <div className='rDesc'>{item.desc}</div>
                <div className='rMax'>Max. Personas: <strong>{item.maxPeople}</strong></div>
                <div className='rPrice'>Precio: <strong>${item.price}</strong></div>
              </div>
              {item.roomNumbers.map((roomNumbers) => (
                <div className="room" key={roomNumbers._id}>
                  <label>{roomNumbers.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumbers._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumbers)}
                  />
                </div>
              ))}
            </div>
          ))
        )}
        {errorText && <div className="error">{errorText}</div>}
        <button onClick={handleClick} className='rButton'>Reservar Ahora</button>
      </div>
    </div>
  )
}

export default Reserve;
