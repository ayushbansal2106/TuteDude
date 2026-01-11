import React, { useCallback } from 'react';
import useFetch from './hooks/useFetch';

const makeMockPhotos = () => {
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

  const colors = [
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

  const list = [];
  for (let i = 0; i < total; i += 1) {
    list.push({
      id: `p-${i + 1}`,
      title: labels[i % labels.length],
      color: colors[i % colors.length],
    });
  }
  return list;
};

const mockPhotos = makeMockPhotos();

function App() {
  const checkConnectivity = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('Network offline. Check your connection.');
    }
    return true;
  }, []);

  const loadPhotos = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 250));
    await checkConnectivity();
    return mockPhotos;
  }, [checkConnectivity]);

  const { data, loading, error, refetch } = useFetch(loadPhotos);
  const photos = Array.isArray(data) ? data : [];

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
        <p className="lede">Simple placeholder grid using a custom hook.</p>
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
