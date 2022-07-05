import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

export default function useFetch(url: string) {
  const [data, setData] = useState([]);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    }());
  }, [url]);

  return { data, error, loading };
}
