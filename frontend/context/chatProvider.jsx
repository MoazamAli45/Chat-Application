import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
//    Creating a Context Of Chat
const ChatContext = createContext();

//   To Provide the Context to the App
export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));

    setUser(data);

    if (!data) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};
export default ChatContext;
ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
