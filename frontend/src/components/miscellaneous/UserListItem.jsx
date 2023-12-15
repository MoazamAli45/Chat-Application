import { Avatar, Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const UserListItem = ({ user }) => {
  return (
    // <div className="flex items-center gap-2 cursor-pointer" key={user._id}>
    //   <Avatar name={user.name} size="sm" src={user.profilePic} />
    //   <Text className="text-sm">{user.name}</Text>
    // </div>
    <Box
      cursor={"pointer"}
      className="flex items-center gap-2"
      bg="#E8E8E8"
      w="100%"
      color={"black"}
      py={2}
      px={3}
      borderRadius={5}
      _hover={{
        background: "#3BB2AC",
        color: "white",
      }}
    >
      <Avatar
        name={user.name}
        size="sm"
        src={user.profilePic}
        mr={2}
        cursor={"pointer"}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize={"xs"}>
          <b>Email:</b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

UserListItem.propTypes = {
  user: PropTypes.object,
};
