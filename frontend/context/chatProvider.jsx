import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
//    Creating a Context Of Chat
const ChatContext = createContext();
//
//   To Provide the Context to the App
export const ChatProvider = ({ children }) => {
  //     USER STATE
  const [user, setUser] = useState();
  //    SELECTED CHAT
  const [selectedChat, setSelectedChat] = useState();
  //    CHATS
  const [chats, setChats] = useState([]);
  //    For Again Fetching
  const [fetchAgain, setFetchAgain] = useState(false);
  //  FOR NOTIFICATION
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));

    setUser(data);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export default ChatContext;
ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
