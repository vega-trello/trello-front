import { NavLink, useNavigate } from "react-router";
import "./Header.css";
import { Box, Button, Heading, Menu, Portal, Text } from "@chakra-ui/react";
import { MdAccountCircle } from "react-icons/md";
import { useCallback } from "react";
import API from "../api/api";
import ThemeSwitcher from "./ThemeSwitcher";
import useUser from "../hooks/useUser";

function User() {
  const user = useUser();
  const navigate = useNavigate();

  const quit = useCallback(async () => {
    await API.Logout();
    navigate("/login");
  }, [navigate]);

  if (user === undefined || user === null) return <></>;

  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <Button variant="plain">
          <Text>{user.username}</Text>
          <MdAccountCircle />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="preferences">
              <NavLink to="/preferences">Настройки</NavLink>
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item value="quit" onSelect={quit}>
              Выйти
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

function Header() {
  return (
    <Box as="header" id="main-header" bg="Background" shadow="xs">
      <div className="inner">
        <div className="left">
          <NavLink to="/" end style={{ color: "inherit" }}>
            <Heading id="title">Trega</Heading>
          </NavLink>
        </div>
        <div className="right">
          <User />
          <ThemeSwitcher />
        </div>
      </div>
    </Box>
  );
}

export default Header;
