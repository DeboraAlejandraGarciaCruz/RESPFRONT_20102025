import { createContext, useContext, useState } from 'react';

const MetricsContext = createContext();

export function MetricsProvider({ children }) {
  const [productViews, setProductViews] = useState({});

  const trackProductView = (id) => {
    setProductViews((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <MetricsContext.Provider value={{ productViews, trackProductView }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  return useContext(MetricsContext);
}
