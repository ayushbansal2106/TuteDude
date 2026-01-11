import { useCallback, useEffect, useRef, useState } from 'react';

const useFetch = (source, options = {}) => {
  const { immediate = true, config = {} } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!source) {
      setError(new Error('No source provided'));
      setLoading(false);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      let result;

      if (typeof source === 'function') {
        result = await source();
      } else if (typeof source === 'string') {
        const response = await fetch(source, {
          signal: controller.signal,
          ...config,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        result = await response.json();
      } else {
        throw new Error('Unsupported source type');
      }

      setData(result);
    } catch (err) {
      if (err.name === 'AbortError') {
        setLoading(false);
        return;
      }
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => controllerRef.current?.abort();
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;
