import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const navItems = [
  { to: '/uploads', label: 'Загрузки' },
  { to: '/uploads/new', label: 'Новая загрузка' },
  { to: '/defects', label: 'Дефекты' },
  { to: '/tasks', label: 'Задания' },
];

function AppLayout() {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);
  const { pathname } = useLocation();

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
            key={item.to}
            component={RouterNavLink}
            to={item.to}
            label={item.label}
            active={pathname === item.to}
            onClick={closeMenu}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
