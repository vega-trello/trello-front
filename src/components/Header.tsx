import { NavLink } from "react-router";
import "./Header.css";
import {
  Box,
  Button,
  Heading,
  Icon,
  Menu,
  Portal,
  Spacer,
  Switch,
  Text,
} from "@chakra-ui/react";
import { MdAccountCircle } from "react-icons/md";
import { useColorMode } from "./ui/color-mode";
import { FaMoon, FaSun } from "react-icons/fa";

type HeaderProps = {
  userUUID: string;
};

function User({ userUUID }: { userUUID: string }) {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <Button variant="plain">
          <Text>{userUUID}</Text>
          <MdAccountCircle />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="colorTheme" closeOnSelect={false}>
              <Switch.Root
                colorPalette="blue"
                checked={colorMode === "dark"}
                onCheckedChange={({ checked }) =>
                  setColorMode(checked ? "dark" : "light")
                }
                flexGrow={1}
              >
                <Switch.HiddenInput />
                <Switch.Label>Тема</Switch.Label>
                <Spacer />
                <Switch.Control>
                  <Switch.Thumb />
                  <Switch.Indicator fallback={<Icon as={FaSun} />}>
                    <Icon as={FaMoon} />
                  </Switch.Indicator>
                </Switch.Control>
              </Switch.Root>
            </Menu.Item>
            <Menu.Item value="preferences">
              <NavLink to="/preferences">Настройки</NavLink>
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item value="quit">Выйти</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

function Header({ userUUID }: HeaderProps) {
  return (
    <Box as="header" id="main-header" bg="Background" shadow='xs'>
      <div className="inner">
        <div className="left">
          <NavLink to="/" end style={{ color: "inherit" }}>
            <Heading id="title">Trega</Heading>
          </NavLink>
        </div>
        <div className="right">
          <User userUUID={userUUID} />
        </div>
      </div>
    </Box>
  );
}

export default Header;
