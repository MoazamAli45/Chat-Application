import { useContext } from "react";
import ChatPageTopBar from "../components/ChatPageTopBar";
import ChatContext from "../../context/chatProvider";
import Background from "/background.jpg";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
const ChatPage = () => {
  const chatCtx = useContext(ChatContext);
  console.log(chatCtx.user);
  return (
    <div
      className="w-full  bg-no-repeat bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      <ChatPageTopBar />
      <div className="flex ">
        <MyChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
