import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Flexible data loader: works with either a URL (fetch) or a function that returns data/promise.
const useFetch = (source, options) => {
  const immediate = options?.immediate ?? true;
  const config = useMemo(() => options?.config || null, [options?.config]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);
  const controllerRef = useRef();

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
          ...(config || {}),
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
      if (err.name === 'AbortError') return;
      setError(err);
      setData(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [source, config]);

  useEffect(() => {
    if (immediate && source) {
      fetchData();
    }

    return () => controllerRef.current?.abort();
  }, [fetchData, immediate, source]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;
