import ScrollableFeed from "react-scrollable-feed";
import PropTypes from "prop-types";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./utils/ScrollableChatLogic";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import ChatContext from "../../context/chatProvider";
const ScrollableChat = ({ messages }) => {
  const { user } = useContext(ChatContext);
  //   console.log(user);
  // console.log(messages);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.data.user._id) ||
              isLastMessage(messages, i, user.data.user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.profilePic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.data.user._id ? "#BEE3F8" : "pink"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user.data.user._id
                ),
                marginTop: isSameUser(messages, m, i, user.data.user._id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

ScrollableChat.propTypes = {
  messages: PropTypes.array,
};
