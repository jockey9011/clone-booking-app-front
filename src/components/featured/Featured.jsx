import useFetch from "../../Hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error, reFetch } = useFetch(
    "/hotels/countByCity?cities[]=Bogota&cities[]=Cartagena%20de%20Indias"
  );
  


  return (
    <>
    <h1>Principales Ciudades</h1>
    <div className="featured">
      {loading ? (
        "Cargando, por favor espera"
      ) : (
        <>
          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/498247696.jpg?k=1b7f9a2447b4c73124e6ce216e69909be2d087bc59f4126ce3e6cb5011a3e37d&o=&hp=1"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Bogotá</h1>
              <h4>{data[0]} propiedades</h4>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/538743715.jpg?k=f9b7f2c1d8b6fa9b6474a6ce048ae5bf4f886f44af0e7f15713b27382ca4e3fd&o=&hp=1"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Cartagena</h1>
              <h4>{data[1]} propiedades</h4>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/505998177.jpg?k=8f2e857fba95388f1bf11f67f87b8ed3bafdf36e6c0676c9d1923d8ced566fc5&o=&hp=1"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Medellín</h1>
              <h4>{data[2]} propiedades</h4>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};


export default Featured;

