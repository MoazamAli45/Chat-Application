import { Skeleton, Stack } from "@chakra-ui/react";

const UserLoading = () => {
  return (
    <Stack>
      <Skeleton height="30px" />
      <Skeleton height="30px" />
      <Skeleton height="30px" />
    </Stack>
  );
};

export default UserLoading;
