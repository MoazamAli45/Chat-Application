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
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import ChatContext from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
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
const ChatPageTopBar = () => {
  const { user } = useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [userfound, setUserfound] = useState(true);

  const navigate = useNavigate();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // console.log(user);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
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
              <div className="flex flex-col gap-2 mt-2">
                {searchResult?.map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    // onClick={() => {
                    //   navigate(`/chat/${user._id}`);
                    //   onClose();
                    // }}
                  />
                ))}
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatPageTopBar;
