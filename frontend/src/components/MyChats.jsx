import { useContext, useEffect, useState } from "react";
import ChatContext from "../../context/chatProvider";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSender } from "./utils/getSender";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import UserLoading from "./miscellaneous/UserLoading";
const MyChats = () => {
  const { selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
  //    LOGGED USER COMPONENT STATE TO SHOW THE CHAT ACCORDINGLY
  const [loggedUser, setLoggedUser] = useState();
  console.log("LOGGED USER", loggedUser);
  const toast = useToast();

  const fetchChats = async () => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${data?.token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/chat`,
        config
      );
      // console.log(data, "CHECK");
      setChats(data?.chats);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(data?.data?.user);
    fetchChats();
  }, []);
  return (
    <Box
      className={selectedChat ? "hidden md:block" : "block"}
      m={3}
      w={{
        base: "95%",
        md: "25%",
      }}
      flexDir={"row"}
      bg={"white"}
      p={5}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        d={"flex"}
        flexDir={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        pb={3}
        px={3}
        w={"100%"}
      >
        <div className="flex gap-3">
          <Text fontSize={"xl"} fontWeight={"semibold"}>
            My Chats
          </Text>
          <GroupChatModal>
            <Button
              variant={"ghost"}
              className="ml-auto bg-gray-300 flex gap-2"
            >
              Create Group Chat
              <AddIcon className="text-[12px]" />
            </Button>
          </GroupChatModal>
        </div>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        minH="63vh"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"auto"} height={"360px"}>
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#3BB2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? //    To check if user[0] is logged in user  then display other name
                      getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <UserLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
