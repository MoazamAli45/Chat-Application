import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useContext, useState, useEffect } from "react";
import ChatContext from "../../context/chatProvider";
import { getSender, getSenderFull } from "./utils/getSender";
import UpdateGroupModel from "./miscellaneous/UpdateGroupModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
const SingleChat = () => {
  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/message/${selectedChat._id}`,
        config
      );
      setMessages(data?.messages);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  console.log(messages);
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessageHandler = async () => {
    if (!newMessage) return;

    // send message
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const body = {
      chatId: selectedChat._id,
      content: newMessage,
    };
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message`,
        body,
        config
      );
      console.log(data, "Message");
      setNewMessage("");
      setMessages([...messages, data?.message]);
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
      {
        setLoading(false);
      }
    }
  };

  const sendMessageOnKey = (e) => {
    if (e.key === "Enter" && newMessage) {
      sendMessageHandler();
    }
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full">
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            className="flex  w-full  gap-1"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <div className="flex justify-between flex-1 ">
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </div>
            ) : (
              <div className="flex justify-between flex-1 ">
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupModel chat={selectedChat} />
              </div>
            )}
          </Box>
          <Box
            className="flex flex-col
          justify-end
          bg-[#E8E8E8]
          w-full
          h-full
          rounded-lg
          overflow-hidden
          px-2
          "
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                className="flex  flex-col overflow-y-scroll "
                style={{
                  scrollbarWidth: "none",
                }}
              >
                {/* message */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessageOnKey}
              className="flex items-center
                gap-2
                my-2
                w-[90%]
                mx-auto
          
                "
            >
              {" "}
              <Input
                variant="filled"
                bg="white"
                placeholder="Type a message..."
                className="rounded-full"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button
                colorScheme="blue"
                variant="solid"
                onClick={sendMessageHandler}
              >
                Send
              </Button>
            </FormControl>
          </Box>
        </div>
      ) : (
        <Box className="flex items-center justify-center px-[150px]">
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
