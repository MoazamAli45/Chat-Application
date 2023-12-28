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
} from "@chakra-ui/react";

import { FaEye } from "react-icons/fa";
import { useContext, useState } from "react";
import ChatContext from "../../../context/chatProvider";
import SelectedUserBadge from "./SelectedUserBadge";
const UpdateGroupModel = () => {
  const { selectedChat } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(selectedChat.users, "Check");
  //    Component States
  const [groupChatName, setGroupChatName] = useState("");

  const handleRename = () => {};
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
                  //   handleFunction={() => deleteSelectedUser(user)}
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
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                // onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red">Leave Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModel;
