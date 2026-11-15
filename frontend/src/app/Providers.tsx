import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { UploadsProvider } from '../entities/upload/index.ts';
import { RepairTasksProvider } from '../entities/repair-task/index.ts';
import { theme } from './theme.ts';

type ProvidersProps = {
  children: ReactNode;
};

/** Оформление, маршрутизация и общее состояние приложения. */
function Providers({ children }: ProvidersProps) {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <UploadsProvider>
          <RepairTasksProvider>{children}</RepairTasksProvider>
        </UploadsProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default Providers;