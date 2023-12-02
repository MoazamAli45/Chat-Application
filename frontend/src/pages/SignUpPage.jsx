import { Link } from "react-router-dom";
import Chat from "../assets/chat";
import { Button, useToast } from "@chakra-ui/react";
import axios from "axios";

import { useState } from "react";
const SignUpPage = () => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file === undefined) {
      toast({
        title: "Error",
        description: "Please select a file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg"
    ) {
      toast({
        title: "Error",
        description: "Please select a valid file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chatApp");
    data.append("cloud_name", "do9edvwmw");
    fetch("https://api.cloudinary.com/v1_1/do9edvwmw/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setProfilePicture(data.url);
        console.log(data.url);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast({
          title: "Error",
          description: "Facing Error in Uploading Files",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        return;
      });
    // Handle the uploaded file as needed, e.g., you can save it to state
    // console.log("Uploaded file:", file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(name, email, password, profilePicture);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const data = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/auth/register`,
        { name, email, password, profilePicture },
        config
      );
      toast({
        title: "Success",
        description: "Account created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // console.log(data.data.data);
      setLoading(false);
      JSON.stringify(
        localStorage.setItem("userInfo", JSON.stringify(data?.data?.data))
      );
    } catch (err) {
      toast({
        title: "Error",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    } finally {
      setEmail("");
      setPassword("");
      setName("");
      setProfilePicture("");
    }
  };

  // console.log(import.meta.env.VITE_API_URL);
  return (
    <section className="bg-gray-50 pt-5">
      <div className="flex flex-col items-center justify-center px-6 my-20  mx-auto md:h-screen lg:py-0">
        <div className="flex items-center flex-col text-xl my-[40px]  font-semibold text-gray-900">
          <p className="hidden">Chat Application</p>
          <Chat />
        </div>
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="example@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="profile"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Choose a profile picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="profilePicture"
                  id="profilePicture"
                  onChange={handleFileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>

              <Button
                colorScheme="blue"
                width={"100%"}
                color={"white"}
                type="submit"
                isLoading={loading}
                // className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={submitHandler}
              >
                Sign up
              </Button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
