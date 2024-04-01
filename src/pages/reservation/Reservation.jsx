import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './reservation.css'; 
import moment from 'moment';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';

axios.defaults.baseURL = 'https://clone-booking-app-1.onrender.com/api';
axios.defaults.withCredentials = true;

const Reservation = () => {
  const { user, userId } = useContext(AuthContext); 
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/bookings/user/${userId}`);
          console.log('Response from server:', response.data);
          setBookings(response.data);

          const hotelIds = response.data.map(booking => booking.hotelId);
          const uniqueHotelIds = [...new Set(hotelIds)];
          const hotelInfo = {};
          for (const hotelId of uniqueHotelIds) {
            const hotelResponse = await axios.get(`/hotels/find/${hotelId}`);
            hotelInfo[hotelId] = hotelResponse.data.name;
          }
          setHotels(hotelInfo);
        } catch (error) {
          console.error('Error fetching user bookings:', error);
        }
      }
    };

    fetchUserBookings();
  }, [userId]);

  console.log('User bookings:', bookings);

  // Función para eliminar una reserva
  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`/bookings/${bookingId}`);
      // Actualizar la lista de reservas después de eliminar
      const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
      setBookings(updatedBookings);
      alert('Reserva eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error al eliminar la reserva');
    }
  };

  // Función para abrir la ventana modal de edición de reserva
  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Función para cerrar la ventana modal
  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

 // Función para actualizar una reserva
const updateBooking = async (updatedBooking) => {
  try {
   
    const updatedBookingUTC = {
      ...updatedBooking,
      checkIn: moment(updatedBooking.checkIn).utc().format(),
      checkOut: moment(updatedBooking.checkOut).utc().format()
    };
    const response = await axios.put(`/bookings/${updatedBooking._id}`, updatedBookingUTC);
    console.log('Updated booking:', response.data);
    const updatedBookings = bookings.map(booking => (booking._id === response.data._id ? response.data : booking));
    setBookings(updatedBookings);
    alert('Reserva actualizada exitosamente');
    closeModal(); 
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Error al actualizar la reserva');
  }
};

useEffect(() => {
  const fetchHotelImages = async () => {
    try {
      const images = {};
      const uniqueHotelIds = [...new Set(bookings.map(booking => booking.hotelId))];
      for (const hotelId of uniqueHotelIds) {
        const response = await axios.get(`/images/${hotelId}`);
        const imageUrl = response.data[0]; // Obtiene la primera imagen
        images[hotelId] = imageUrl;
      }
      setHotelImages(images);
    } catch (error) {
      console.error('Error fetching hotel images:', error);
    }
  };

  fetchHotelImages();
}, [bookings]);

  return (
    <>
    <Navbar/>
    <Header type="list" />
    <div className="reservation-container">
      <h2 className='reservation-title'>Reservaciones de {user ? user.username : 'Usuario'}</h2> 
      <ul className="reservation-list">
      {bookings.map((booking) => (
  <li key={booking._id} className="reservation-item">
    {hotelImages[booking.hotelId] && (
      <img src={hotelImages[booking.hotelId]} alt={`Hotel ${booking.hotelId}`} className='hotel-image'/>
    )}
    <p className="booking-info">Hotel: {hotels[booking.hotelId]}</p>
    <p className="booking-info">Fecha de inicio: {new Date(booking.checkIn).toLocaleDateString()}</p>
    <p className="booking-info">Fecha de fin: {new Date(booking.checkOut).toLocaleDateString()}</p>
    
    <div className="buttons-container">
      <button className="edit-button" onClick={() => openModal(booking)}>Editar</button>
      <button className="delete-button" onClick={() => deleteBooking(booking._id)}>Eliminar</button>
    </div>
  </li>
))}

      </ul>
      <MailList/>
      <Footer />
      {/* Ventana modal para editar reserva */}
      {isModalOpen && (
            <div className="modal">
            <div className="modal-content">
              <span className="close-modal" onClick={closeModal}>&times;</span> {/* Botón para cerrar el modal */}
              <h2>Editar Reserva</h2>
              <div className="edit-form">
                <label htmlFor="checkIn">Fecha de Entrada:</label>
                <input
                  type="date"
                  id="checkIn"
                  value={selectedBooking.checkIn ? selectedBooking.checkIn.substring(0, 10) : ''}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, checkIn: e.target.value })}
                />
      
                <label htmlFor="checkOut">Fecha de Salida:</label>
                <input
                  type="date"
                  id="checkOut"
                  value={selectedBooking.checkOut ? selectedBooking.checkOut.substring(0, 10) : ''}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, checkOut: e.target.value })}
                />
                
                <button onClick={() => updateBooking(selectedBooking)}>Guardar Cambios</button>
              </div>
            </div>
          </div>
      
      )}
    </div>
    </>
  );
};

export default Reservation;
