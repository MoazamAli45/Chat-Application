import { IoIosSearch } from "react-icons/io";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

const ChatPageTopBar = () => {
  return (
    <>
      <div className="flex justify-between items-center bg-gray-200 p-2 sm:px-[30px] ">
        <Tooltip label="Search User" hasArrow aria-label="A tooltip">
          <Button variant="ghost">
            <IoIosSearch />
            <Text px={4} className="hidden sm:flex">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"24px"}>Team Chat App</Text>

        <div className="flex gap-[5px]">
          <Menu>
            <MenuButton>
              <FaBell />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar name="Moazam" size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem>My Profile</MenuItem>
              <MenuItem>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default ChatPageTopBar;
