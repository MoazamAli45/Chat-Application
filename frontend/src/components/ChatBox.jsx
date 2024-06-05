import { Box } from "@chakra-ui/react";
import { useContext } from "react";
import ChatContext from "../../context/chatProvider";
import SingleChat from "./SingleChat";
const ChatBox = () => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <Box
      className={
        selectedChat
          ? "flex md:flex min-h-[80vh] md:min-h-min "
          : "hidden md:flex min-h-[80vh] md:min-h-min"
      }
      m={3}
      w={{
        base: "95%",
        md: "75%",
      }}
      flexDir={"row"}
      bg={"white"}
      p={5}
      borderRadius={"lg"}
      borderWidth={"1px"}
      backgroundColor={"#F8F8F8"}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
