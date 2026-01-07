import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useFetch from './hooks/useFetch';

const buildMockPhotos = () => {
  const total = 120;
  const labels = [
    'accusamus beatae ad facilis cum similique',
    'reprehenderit est deserunt velit ipsam',
    'officia porro iure quia iusto qui ipsa ut',
    'culpa odio esse rerum omnis laboriosam',
    'natus nisi omnis corporis facere molestiae',
    'accusamus ea aliquid et amet sequi',
    'officia delectus consequatur vero aut',
    'aut porro officiis laborum odit ea laudantium',
    'et ea illo et sit voluptas animi blanditiis',
    'harum velit vero totam',
    'non neque eligendi molestiae repudiandae',
    'odio enim voluptatem quidem aut nihil',
  ];

  const palette = [
    '#78c26d',
    '#5e1ea8',
    '#22e78f',
    '#cc1f74',
    '#ea6ea2',
    '#1c57e0',
    '#a6eadc',
    '#4c2b66',
    '#6da95c',
    '#a44e9b',
    '#3a3938',
    '#b3d47c',
  ];

  const items = [];
  for (let i = 0; i < total; i += 1) {
    const color = palette[i % palette.length];
    const label = labels[i % labels.length];
    items.push({ id: `p-${i + 1}`, title: label, color });
  }
  return items;
};

const mockPhotos = buildMockPhotos();

function App() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  const checkConnectivity = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('Network offline. Check your connection.');
    }

    try {
      // Tiny connectivity probe used by Chrome; no content, low overhead.
      await fetch('https://www.gstatic.com/generate_204', {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
      });
      return true;
    } catch (err) {
      throw new Error('Network offline. Check your connection.');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPhotos = useCallback(() => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await checkConnectivity();
          if (isOffline) {
            reject(new Error('Network offline. Check your connection.'));
            return;
          }
          resolve(mockPhotos);
        } catch (err) {
          reject(err);
        }
      }, 250);
    });
  }, [checkConnectivity, isOffline]);

  const { data, loading, error, refetch } = useFetch(loadPhotos);

  const photos = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data;
  }, [data]);

  if (loading) {
    return (
      <div className="full-screen">
        <div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="full-screen error-screen">
        <div>
          <p>Error: {error.message || 'Failed to fetch'}</p>
          <div className="controls" style={{ marginTop: 12 }}>
            <button className="button" onClick={refetch}>Reload data</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>Photos</h1>
        <p className="lede">Dummy placeholders to mirror the provided layout.</p>
        <div className="controls">
          <button className="button" onClick={refetch}>Reload data</button>
        </div>
      </header>

      <section className="grid">
        {photos.map((item) => (
          <article className="card" key={item.id}>
            <div className="swatch" style={{ backgroundColor: item.color }}>
              <span className="swatch-text">600 x 600</span>
            </div>
            <div className="card-body">
              <p className="caption" title={item.title}>
                {item.title}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;
