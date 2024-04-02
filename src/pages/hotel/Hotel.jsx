import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import useFetch from "./../../Hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import axios from "axios";


axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

const Hotel = () => {
  const location = useLocation();
  const hId = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [days, setDays] = useState(0);
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { data, loading, error, reFetch } = useFetch(`/hotels/find/${hId}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dates, options } = useContext(SearchContext);
  const [reviews, setReviews] = useState([]);

  const MILISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  const dayDifference = (date1, date2) => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILISECONDS_PER_DAY);
    return diffDays;
  };

  useEffect(() => {
    try {
      localStorage.setItem("startDate", new Date(dates[0].startDate));
      localStorage.setItem("endDate", new Date(dates[0].endDate));
      const currentDay = dayDifference(
        dates[0].endDate,
        dates[0].startDate
      );
      setDays(currentDay);
    } catch (err) {
      let start = new Date(localStorage.getItem("startDate"));
      let end = new Date(localStorage.getItem("endDate"));
      const currentDay = dayDifference(end, start);
      setDays(currentDay);
    }
  }, []);

  useEffect(() => {
    if (data && data._id) {
      const fetchImages = async () => {
        try {
          const response = await axios.get(`/images/${data._id}`);
          const fetchedImages = response.data;
          setImages(fetchedImages);
        } catch (error) {
          console.error(error);
        }
      };
      fetchImages();
    }
  }, [data]);

  useEffect(() => {
    if (data && data._id) {
      const loadReviews = async () => {
        try {
          const response = await axios.get(`/reviews/${hId}`);
          setReviews(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      loadReviews();
    }
  }, [data, hId]);
  
  

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      // Crear una nueva reseña
      await axios.post('/reviews/create', {
        rating,
        comment,
        hotelId: hId,
        userId: user._id,
      });
      
      // Limpiar los campos de reseña después de enviar
      setRating(0);
      setComment('');
  
      // Actualizar la interfaz o mostrar un mensaje de éxito
      console.log("Reseña creada exitosamente");
    } catch (error) {
      // Manejar errores
      console.error(error);
    }
  };
  
  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
  <Navbar />
  <Header type="list" />
  {loading ? (
    "Cargando..."
  ) : (
    <div className="hotelContainer">
      {open && (
        <div className="slider">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="close"
            onClick={() => setOpen(false)}
          />
          <FontAwesomeIcon
            icon={faCircleArrowLeft}
            className="arrow"
            onClick={() => handleMove("l")}
          />
          <div className="sliderWrapper">
            <img
              src={images[slideNumber]}
              alt=""
              className="sliderImg"
            />
          </div>
          <FontAwesomeIcon
            icon={faCircleArrowRight}
            className="arrow"
            onClick={() => handleMove("r")}
          />
        </div>
      )}
      <div className="hotelWrapper">
        <button className="bookNow">
          Reserva o Separa Ahora!
        </button>
        <h1 className="hotelTitle">{data.name}</h1>
        <div className="hotelAddress">
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{data.address}</span>
        </div>
        <span className="hotelDistance">
          Excelente ubicación – {data.distance}m desde el centro
        </span>
        <span className="hotelPriceHighlight">
          Reserva una estadía por ${data.cheapestPrice} en la propiedad
          y el taxi al aeropuerto es gratis
        </span>

        <div className="hotelImages">
          {images.map((imageUrl, index) => (
            <div className="hotelImgWrapper" key={index}>
              <img
                src={imageUrl}
                alt={`Image ${index}`}
                className="hotelImg"
              />
            </div>
          ))}
        </div>
        <div className="hotelDetails">
          <div className="hotelDetailsTexts">
            <h1 className="hotelTitle">{data.title}</h1>
            <p className="hotelDesc">
              {data.desc}
            </p>
          </div>
          <div className="hotelDetailsPrice">
            <h1>¡Perfecto para {days} noches!</h1>
            <span>
              Esta propiedad está en una excelente ubicación.
            </span>
            <h2>
              <b>
                {data && days && options && !isNaN(days) && data.cheapestPrice && !isNaN(data.cheapestPrice) && options.room && !isNaN(options.room)
                  ? `$${days * data.cheapestPrice * options.room}`
                  : "Precio no disponible"}
              </b>{" "}({days} nights)
            </h2>
            <button onClick={handleClick}>¡Reservar ahora!</button>
          </div>
        </div>
        <div className="hotelReviews">
          <h2>Reseñas de Usuarios</h2>
          {reviews.length > 0 ? (
            <div>
              {reviews.map((review, index) => (
                <div key={index} className="review">
                  <p>Rating: {review.rating}</p>
                  <p>Comentario: {review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay reseñas disponibles aún.</p>
          )}
        </div>
        {user ? (
          <div>
            <h2>Deja tu reseña</h2>
            <form className="review-form" onSubmit={handleSubmitReview}>
              <label>
                Rating:
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </label>
              <label>
                Comment:
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </label>
              <button type="submit">Enviar reseña</button>
            </form>
          </div>
        ) : (
          <p>Inicia sesión para dejar una reseña</p>
        )}
      </div>
      <MailList />
      <Footer />
    </div>
  )}
  {openModal && <Reserve setOpen={setOpenModal} hotelId={hId} />}
</div>

  );
};

export default Hotel;

