import useFetch from "../../Hooks/useFetch";
import "./featuredProperties.css";
import axios from "axios";
import { useEffect, useState } from "react";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true");
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const fetchImageURLs = async () => {
      try {
        const urls = await Promise.all(
          data.map(async (item) => {
            if (item.photos.length > 0) {
              const photoId = item.photos[0]; 
              try {
                const response = await axios.get(`/images/${photoId}`);
                console.log("Image response:", response);
                if (response.data && response.data.length > 0) {
                  return response.data[0].url; 
                } else {
                  console.log("No image data found for hotel:", item._id);
                  return "";
                }
              } catch (error) {
                console.error("Error fetching image data for hotel:", item._id, error);
                return "";
              }
            } else {
              console.log("No photos found for hotel:", item._id);
              return "";
            }
          })
        );
        console.log("Image URLs for hotels:", urls);
        setImageURLs(urls);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
        setImageURLs([]);
      }
    };

    if (data) {
      fetchImageURLs();
    }
  }, [data]);

  return (
    <div className="fp">
      {loading ? (
        "Cargando, por favor espera"
      ) : (
        <>
          {data.map((item, i) => (
            <div className="fpItem" key={item._id}>
              {imageURLs[i] && (
                <img
                  src={imageURLs[i]}
                  alt=""
                  className="fpImg"
                />
              )}
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Precios desde ${item.cheapestPrice}</span>
              {item.rating && (
                <div className="fpRating">
                  <button>{item.rating}</button>
                  <span>Excelente</span>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
