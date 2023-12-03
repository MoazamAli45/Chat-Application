import { IoIosSearch } from "react-icons/io";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import ChatContext from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
const ChatPageTopBar = () => {
  const { user } = useContext(ChatContext);
  const navigate = useNavigate();
  // console.log(user);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };
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
              <Avatar
                name={user?.user?.name}
                size="sm"
                src={user?.user?.profilePic}
              />
            </MenuButton>
            <MenuList>
              {/*     Profile Modal is custom Component */}
              <ProfileModal user={user?.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default ChatPageTopBar;
