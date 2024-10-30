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
import Lottie from "react-lottie";
import ScrollableChat from "./ScrollableChat";

import animationData from "./animations/typing1.json";

// SOCKET
import io from "socket.io-client";

// const ENDPOINT = "http://localhost:3000/";

// FOR  PRODUCTION
const ENDPOINT = "https://chat-application-beta-wine.vercel.app/";

let socket, selectedChatCompare;

const SingleChat = () => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    fetchAgain,
    setFetchAgain,
    notification,
    setNotification,
  } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  //  FOR TYPING LOGIC
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  //  FOR TYPING ANIMATIONS
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
      //   To RECEIVE MESSAGES in REAL TIME TO JOIN IN A ROOM
      socket.emit("join chat", selectedChat._id);
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
  //   INITIALIZE SOCKET
  useEffect(() => {
    socket = io(ENDPOINT);
    const userData = user?.data?.user;

    //   SENDING DATA FOR SETUP OF SOCKET
    if (userData) {
      socket.emit("setup", userData);
    } else {
      console.log("User data is null or undefined.");
    }
    //   ON Receiving from Server
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    //  TO KEEP BACKUP OF SELECTED CHAT
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  //  FOr Receiving Messages
  //  Every time renders

  useEffect(() => {
    //  IF WE RECEIVE ANYTHING NEW THEN ADD MESSAGES
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //  give notification
        if (!notification.includes(newMessageReceived))
          setNotification([newMessageReceived, ...notification]);
        setFetchAgain(!fetchAgain);
        console.log("NOTIFICATION", notification);
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

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

    console.log("Body", body);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message`,
        body,
        config
      );
      setNewMessage("");
      //  TO SEND MESSAGE TO SERVER
      socket.emit("new message", data?.message);
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
      //  IF ENTER IS PRESSED MEANS STOP TYPING
      socket.emit("stop typing", selectedChat._id);
      sendMessageHandler();
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    //  AFTER 3 SECONDS STOP TYPING
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full ">
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
                {getSender(user?.data?.user, selectedChat?.users)}
                <ProfileModal
                  user={getSenderFull(user?.data?.user, selectedChat?.users)}
                />
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
                {isTyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      width={60}
                      // height={100}
                      size={20}
                      style={{
                        marginLeft: "20px",
                        marginBottom: 15,
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
            <FormControl
              onKeyDown={sendMessageOnKey}
              className="flex items-center
                gap-2
                my-2
                w-[90%]
                mx-auto
                mt-auto
          
                "
            >
              {" "}
              <Input
                variant="filled"
                bg="white"
                placeholder="Type a message..."
                className="rounded-full"
                value={newMessage}
                onChange={typingHandler}
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
