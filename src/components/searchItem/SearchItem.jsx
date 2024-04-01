import { Link } from "react-router-dom";
import "./searchItem.css";
import axios from "axios";
import { useEffect, useState } from "react";

const SearchItem = ({ item }) => {
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`/images/${item._id}`);
        
        if (response.data && response.data.length > 0) {
          
          const firstImageUrl = response.data[0];
          setImageURL(firstImageUrl);
        } else {
          
          setImageURL(""); 
          console.log("No se encontraron imágenes para el hotel:", item._id);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    
    fetchImage();
  }, [item._id]);

  return (
    <div className="searchItem">
      {imageURL ? (
        <img src={imageURL} alt="" className="siImg" />
      ) : (
        <p>Image Not Available</p>
      )}
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siLocation">{item.city}</span>
        <div>
          <span className="siTaxiOp">WiFi</span>&nbsp;
          <span className="siTaxiOp">Piscina</span>&nbsp;
          <span className="siTaxiOp">Restaurante</span>&nbsp;
          <span className="siTaxiOp">Zona de juegos</span>&nbsp;
          </div>
        <span className="siCancelOp">{item.address}</span>
        <span className="siFeatures">{item.title}</span>
        <span className="siCancelOp">Cancelación gratis </span>
        <span className="siCancelOpSubtitle">
        Puedes cancelar más tarde, ¡asegura este precio hoy!
        </span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <span className="siPrice">${item.cheapestPrice}</span>
          <span className="siTaxOp">Incluye impuestos</span>
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">Ver Disponibilidad</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;

