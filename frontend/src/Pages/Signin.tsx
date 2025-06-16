import { useRef } from "react";
import InputBox from "../Components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

function SignIn() {
  let nameRef = useRef<HTMLInputElement | null>(null);
  let passwordRef = useRef<HTMLInputElement | null>(null);

  async function handleClick() {
    await axios
      .post("http://localhost:3000/api/v1/user/signin", {
        username: nameRef.current?.value,
        password: passwordRef.current?.value,
      })
      .then((response) => {
        nameRef.current && (nameRef.current.value = "");
        passwordRef.current && (passwordRef.current.value = "");
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        navigate("/dashboard");
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.errors?.[0] ||
          err.response.data.error ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      });
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen bg-slate-900 flex justify-center items-center">
      <div className="bg-white w-80 h-full shadow-inner">
        <div className="text-center pt-4 font-semibold text-2xl">SignIn</div>
        <InputBox placeholder="Name@123" label="Username" reference={nameRef} />
        <InputBox
          placeholder="Password123"
          label="Password"
          reference={passwordRef}
        />
        <div className="flex items-center justify-center my-4 flex-col mx-8">
          <div className="text-sm my-0.5">
            Not registered?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer text-blue-700 text-sm font-semibold underline"
            >
              Register
            </span>
          </div>
          <button
            onClick={handleClick}
            className=" flex items-center mx-8 justify-center cursor-pointer shadow-lg bg-black text-white p-2 rounded-md w-full hover:bg-gray-800 transition duration-500 font-extralight"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
