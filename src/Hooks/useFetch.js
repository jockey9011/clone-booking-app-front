import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "https://clone-booking-app-1.onrender.com/api";
/* axios.defaults.baseURL = "http://localhost:3000/api"; */
axios.defaults.withCredentials = true;

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };

};

export default useFetch;