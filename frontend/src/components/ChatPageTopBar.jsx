import { IoIosSearch } from "react-icons/io";
import {
  Avatar,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import ChatContext from "../../context/chatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./miscellaneous/ProfileModal";
//    FOR DRAWER
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import UserLoading from "./miscellaneous/UserLoading";
import UserListItem from "./miscellaneous/UserListItem";
import { getSender } from "./utils/getSender";
import NotificationBadge from "./miscellaneous/NotificationBadge";
const ChatPageTopBar = () => {
  const { user, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [userfound, setUserfound] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // console.log(user);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Content: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chat`,
        { userId },
        config
      );
      // console.log(data);
      setSelectedChat(data?.chat);
    } catch (err) {
      console.log(err);
      toast({
        description: err.response.data.message || "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const searchHandler = async () => {
    if (!search) {
      toast({
        description: "Please Enter a search term",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setSearchResult([]);
      return;
    }
    //    Config
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users?search=${search}`,

        config
      );
      console.log(data);
      if (data.total === 0) {
        setUserfound(false);
      }
      setSearchResult(data.users);
      if (data.total > 0) {
        setUserfound(true);
      }
    } catch (err) {
      console.log(err);
      toast({
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gray-200 p-2 sm:px-[30px] ">
        <Tooltip label="Search User" hasArrow aria-label="A tooltip">
          <Button variant="ghost" onClick={onOpen}>
            <IoIosSearch />
            <Text px={4} className="hidden sm:flex">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"24px"}>Team Chat App</Text>

        <div className="flex gap-[10px]">
          <Menu>
            <MenuButton>
              <NotificationBadge count={notification.length}>
                <FaBell />
              </NotificationBadge>
            </MenuButton>
            <MenuList className="px-2">
              {!notification.length && "No Message Yet!"}
              {notification?.map((msg) => (
                <MenuItem
                  key={msg._id}
                  onClick={() => {
                    setSelectedChat(msg.chat);
                    //  Now removing that notification
                    setNotification(
                      notification.filter((m) => m._id !== msg._id)
                    );
                  }}
                >
                  {msg.chat.isGroupChat
                    ? `New Message in ${msg.chat.chatName}`
                    : `New Message from ${getSender(
                        user?.data?.user,
                        msg.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                name={user?.data?.user?.name}
                size="sm"
                src={user?.data?.user?.profilePic}
              />
            </MenuButton>
            <MenuList>
              {/*     Profile Modal is custom Component */}
              <ProfileModal user={user?.data?.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      {/*   DRAWER */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <div className="flex gap-1">
              <Input
                placeholder="Type here..."
                className="border-none focus:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                colorScheme="blue"
                color={"white"}
                onClick={searchHandler}
              >
                Go
              </Button>
            </div>
            {loading ? (
              <UserLoading />
            ) : !userfound ? (
              <p className="text-center pt-5">No Result found!</p>
            ) : (
              <>
                <div className="flex flex-col gap-2 mt-2">
                  {searchResult?.map((user) => (
                    <UserListItem
                      user={user}
                      key={user._id}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))}
                </div>
                {loadingChat && <Spinner />}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatPageTopBar;
