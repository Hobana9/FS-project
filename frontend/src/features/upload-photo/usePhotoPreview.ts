import { useEffect, useState } from 'react';
import { validatePhoto } from './model.ts';

type PhotoPreviewState = {
  file: File | null;
  photoUrl: string | null;
  error: string | null;
};

export function usePhotoPreview(photo: File | null) {
  const [preview, setPreview] = useState<PhotoPreviewState>({
    file: null,
    photoUrl: null,
    error: null,
  });

  useEffect(() => {
    setPreview({ file: photo, photoUrl: null, error: null });

    if (!photo || validatePhoto(photo)) {
      return;
    }

    let active = true;
    const reader = new FileReader();
    const image = new window.Image();

    function fail() {
      if (active) {
        setPreview({
          file: photo,
          photoUrl: null,
          error: 'Не удалось прочитать изображение. Выберите другой файл.',
        });
      }
    }

    reader.onerror = fail;

    reader.onload = () => {
      if (!active) {
        return;
      }

      const photoUrl = reader.result;

      if (typeof photoUrl !== 'string') {
        fail();
        return;
      }

      image.onload = () => {
        if (active) {
          setPreview({ file: photo, photoUrl, error: null });
        }
      };

      image.onerror = fail;
      image.src = photoUrl;
    };

    reader.readAsDataURL(photo);

    return () => {
      active = false;
      reader.onload = null;
      reader.onerror = null;
      image.onload = null;
      image.onerror = null;

      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [photo]);

  const validationError = photo ? validatePhoto(photo) : undefined;
  const isCurrentPhoto = preview.file === photo;
  const error = validationError ?? (isCurrentPhoto ? preview.error : null);
  const photoUrl = isCurrentPhoto && !error ? preview.photoUrl : null;
  const isLoading = photo !== null && !error && !photoUrl;

  return { photoUrl, error, isLoading };
}