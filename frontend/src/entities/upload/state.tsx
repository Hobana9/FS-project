import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Upload } from './model.ts';
import { initialUploads } from './mock.ts';

export type CreateUploadInput = Omit<Upload, 'id' | 'status' | 'defectCount'>;

type UploadsContextValue = {
  uploads: readonly Upload[];
  addUpload: (input: CreateUploadInput) => void;
};

type UploadsProviderProps = {
  children: ReactNode;
};

const UploadsContext = createContext<UploadsContextValue | null>(null);

export function UploadsProvider({ children }: UploadsProviderProps) {
  const [uploads, setUploads] = useState<Upload[]>(() => [...initialUploads]);

  function addUpload(input: CreateUploadInput) {
    const upload: Upload = {
      ...input,
      id: `u-${crypto.randomUUID()}`,
      status: 'processing',
      defectCount: 0,
    };

    setUploads((currentUploads) => [upload, ...currentUploads]);
  }

  return (
    <UploadsContext.Provider value={{ uploads, addUpload }}>
      {children}
    </UploadsContext.Provider>
  );
}

export function useUploads(): UploadsContextValue {
  const context = useContext(UploadsContext);

  if (context === null) {
    throw new Error('useUploads должен использоваться внутри UploadsProvider');
  }

  return context;
}