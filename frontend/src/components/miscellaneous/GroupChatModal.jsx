import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Box,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ChatContext from "../../../context/chatProvider";
import { useContext } from "react";
import axios from "axios";
import UserListItem from "./UserListItem";
import SelectedUserBadge from "./SelectedUserBadge";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  //    USER SELECTEDUSER FOR GROUP CHAT
  const [selectedUser, setSelectedUser] = useState([]);

  const { user, setChats, chats, setFetchAgain, fetchAgain } =
    useContext(ChatContext);
  //    Toast
  const toast = useToast();

  const searchHandler = async (searchQuery) => {
    setSearchUser(searchQuery);
    if (!searchQuery) return;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users?search=${searchQuery}`,
        config
      );
      setSearchResult(data?.users);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const selectGroup = async (userToAdd) => {
    if (selectedUser.includes(userToAdd)) return;
    setSelectedUser([...selectedUser, userToAdd]);
  };
  const deleteSelectedUser = (userToDelete) => {
    setSelectedUser(
      selectedUser.filter((user) => user._id !== userToDelete._id)
    );
  };
  const submitHandler = async () => {
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chat/group-chat`,
        {
          chatName: groupChatName,
          //  user itself will be added
          users: selectedUser.map((user) => user._id),
        },
        config
      );
      setChats([data?.chat, ...chats]);
      toast({
        title: "Success",
        description: "Group Chat Created Successfully",
        status: "success",
        duration: 3000,
      });
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter Group Chat Name"
                className="border border-gray-300 rounded-md"
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />
              {/*    SELECTED USER */}
              <Box className="flex flex-wrap gap-2">
                {selectedUser.map((user) => (
                  <SelectedUserBadge
                    user={user}
                    handleFunction={() => deleteSelectedUser(user)}
                    key={user._id}
                  />
                ))}
              </Box>
              <Input
                placeholder="Enter User to add in  Group Chat"
                className="border border-gray-300 rounded-md"
                onChange={(e) => searchHandler(e.target.value)}
                value={searchUser}
              />
            </div>
            {loading ? (
              <Text className="text-center">Loading...</Text>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => selectGroup(user)}
                  />
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={submitHandler}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

GroupChatModal.propTypes = {
  children: PropTypes.node,
};
