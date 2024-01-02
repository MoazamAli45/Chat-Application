import {
  Box,
  Button,
  FormControl,
  IconButton,
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
  useToast,
} from "@chakra-ui/react";

import { FaEye } from "react-icons/fa";
import { useContext, useState } from "react";
import ChatContext from "../../../context/chatProvider";
import SelectedUserBadge from "./SelectedUserBadge";
import axios from "axios";
import UserListItem from "./UserListItem";
const UpdateGroupModel = () => {
  const { selectedChat, user, setFetchAgain, fetchAgain, setSelectedChat } =
    useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   FOR TOAST
  const toast = useToast();

  //    Component States
  const [groupChatName, setGroupChatName] = useState("");
  const [searchedUserResult, setSearchedUserResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const handleRename = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/chat/group-chat`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setGroupChatName(data?.groupChat?.chatName);
      // to update the chats
      setSelectedChat(data?.groupChat);
      toast({
        title: "Success",
        description: "Group name Updated Successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      //   To close the modal
      onClose();
      //   To again fetch the list in MyChats.jsx
      setFetchAgain(!fetchAgain);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRenameLoading(false);
    }
  };

  //   For Searching User
  const searchHandler = async (searchQuery) => {
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
      setSearchedUserResult(data?.users);
    } catch (error) {
      console.log(error);
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
  //     ADDING MEMBER TO GROUP
  const addGroupHandler = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      toast({
        title: "Error",
        description: "User already exists in the group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    console.log(
      selectedChat.groupAdmin._id,
      user?.data?.user._id,
      "Check Admin"
    );
    //  FOR CHECKING ADMIN
    //    IF SELECTED CHAT ADMIN IS NOT LOGGED IN USER THEN
    if (selectedChat.groupAdmin._id !== user?.data?.user._id) {
      toast({
        title: "Error",
        description: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chat/group-chat-member`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      //   To update the selected chat
      setSelectedChat(data?.groupChat);
      toast({
        title: "Success",
        description: "User added to the group",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      //   To again fetch the list in MyChats.jsx
      setFetchAgain(!fetchAgain);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeHandler = async (userToDelete) => {
    console.log(userToDelete._id === user?.data?.user._id, "Check");
    //  IF NOT DELETING LOGGED IN USER
    //  LOGGEDIN USER CAN LEAVE THE GROUP
    if (
      selectedChat.groupAdmin._id !== user?.data?.user._id &&
      userToDelete._id !== user?.data?.user._id
    ) {
      toast({
        title: "Error",
        description: "You are not the admin of this group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/chat/group-chat-member`,
        {
          chatId: selectedChat._id,
          userId: userToDelete._id,
        },
        config
      );
      //   To update the selected chat
      console.log(userToDelete._id, user?.data?.user._id, "DELETE CHECK");
      //   IF THE USER IS LOGGED IN USER THEN
      userToDelete._id === user?.data?.user._id
        ? setSelectedChat()
        : setSelectedChat(data?.groupChat);
      toast({
        title: "Success",
        description: "User removed from the group",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      //   To again fetch the list in MyChats.jsx
      setFetchAgain(!fetchAgain);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        d={{
          base: "flex",
        }}
        icon={<FaEye />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center ">
            <Text className="font-thin text-[40px]">
              {" "}
              {selectedChat.chatName}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            isCentered
            className="flex justify-center flex-col items-center"
          >
            <Box className="flex flex-wrap gap-2">
              {selectedChat.users.map((user) => (
                <SelectedUserBadge
                  user={user}
                  handleFunction={() => removeHandler(user)}
                  key={user._id}
                />
              ))}
            </Box>
            <FormControl className="flex ">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
                isLoading={renameLoading}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Text className="text-center">Loading...</Text>
            ) : (
              <div className="flex flex-col gap-2 mt-2 w-full">
                {searchedUserResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => addGroupHandler(user)}
                  />
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => removeHandler(user?.data?.user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModel;
