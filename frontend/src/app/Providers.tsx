import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './theme.ts';

type ProvidersProps = {
  children: ReactNode;
};

/** Общие обёртки приложения: оформление Mantine и маршрутизация. */
function Providers({ children }: ProvidersProps) {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>{children}</BrowserRouter>
    </MantineProvider>
  );
}

export default Providers;
