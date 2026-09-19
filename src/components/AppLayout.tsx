import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const navItems = [
  { key: 'uploads', label: 'Загрузки' },
  { key: 'new-upload', label: 'Новая загрузка' },
  { key: 'defects', label: 'Дефекты' },
  { key: 'tasks', label: 'Задания' },
];

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  const [menuOpened, { toggle: toggleMenu }] = useDisclosure(false);
  const [activeItem, setActiveItem] = useState('uploads');

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !menuOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm">
          <Burger opened={menuOpened} onClick={toggleMenu} hiddenFrom="sm" size="sm" />
          <Title order={4}>Контроль дорожной разметки</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            label={item.label}
            active={item.key === activeItem}
            onClick={() => setActiveItem(item.key)}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
