import { useState, useEffect } from 'react';
import { Image } from 'react-native';

export const useOptimizedImage = (uri, fallbackUri = null) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    source: null,
  });

  useEffect(() => {
    if (!uri) {
      setImageState({ loading: false, error: true, source: null });
      return;
    }

    setImageState({ loading: true, error: false, source: null });

    // Preload image
    Image.prefetch(uri)
      .then(() => {
        setImageState({
          loading: false,
          error: false,
          source: { uri },
        });
      })
      .catch(() => {
        if (fallbackUri) {
          Image.prefetch(fallbackUri)
            .then(() => {
              setImageState({
                loading: false,
                error: false,
                source: { uri: fallbackUri },
              });
            })
            .catch(() => {
              setImageState({ loading: false, error: true, source: null });
            });
        } else {
          setImageState({ loading: false, error: true, source: null });
        }
      });
  }, [uri, fallbackUri]);

  return imageState;
};