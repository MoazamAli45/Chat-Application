import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useContext } from "react";
import ChatContext from "../../context/chatProvider";
import { getSender, getSenderFull } from "./utils/getSender";
const SingleChat = () => {
  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);
  return (
    <>
      {selectedChat ? (
        <>
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
              <>
                {selectedChat.chatName.toUpperCase()}
                {/* <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  /> */}
              </>
            )}
          </Box>
        </>
      ) : (
        // to get socket.io on same page
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
