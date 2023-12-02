import { Link } from "react-router-dom";
import Chat from "../assets/chat";
import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(email, password);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/auth/login`,
        { email, password },
        config
      );
      toast({
        title: "Success",
        description: "Account LoggedIn successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log(data.data.data);
      setLoading(false);
      JSON.stringify(
        localStorage.setItem("userInfo", JSON.stringify(data?.data?.data))
      );
      navigate("/chat");
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    setEmail("");
    setPassword("");
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center flex-col text-2xl font-semibold text-gray-900">
          <p className="hidden"> Chat Application</p>
          <Chat />
        </div>
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
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

              <Button
                colorScheme="blue"
                width={"100%"}
                color={"white"}
                type="submit"
                isLoading={loading}
                // className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={submitHandler}
              >
                Sign in
              </Button>
              <p className="text-sm font-light text-gray-500">
                Don&rsquo;t have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
