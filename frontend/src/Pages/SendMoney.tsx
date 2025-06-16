import { useRef } from "react";
import InputBox from "../Components/InputBox";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

function SendMoney() {
  let amountRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const handleSendMoney = async () => {
    if (amountRef.current?.value === "") {
      return toast.error("Amount cannot be empty", {
        theme: "dark",
        position: "top-right",
        transition: Bounce,
        autoClose: 5000,
        draggable: true,
        pauseOnHover: true,
      });
    }
    await axios
      .post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          amount: Number(amountRef.current?.value),
          to: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message || "Transferred money successfully.", {
          theme: "dark",
          transition: Bounce,
          position: "top-right",
          autoClose: 5000,
          draggable: true,
          pauseOnHover: true,
        });
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error(
          (err.response.data.message && err.response.data.error[0]) ||
            err.response.data.error ||
            "Something went wrong",
          {
            theme: "dark",
            transition: Bounce,
            position: "top-right",
            autoClose: 5000,
            draggable: true,
            pauseOnHover: true,
          }
        );
      });
  };

  const { id, username } = useParams();
  return (
    <div className="bg-slate-900 flex items-center justify-center w-screen h-screen">
      <div className="bg-white flex flex-col items-center w-80 h-fit p-2 rounded-sm">
        <div className="text-2xl font-semibold text-black p-2">Send Money</div>
        <div className="flex flex-col w-full mx-8">
          <InputBox
            reference={amountRef}
            placeholder="Amount to send"
            label="Amount"
          />
          <div className="flex flex-col">
            <div className="text-sm mx-8">To:</div>
            <input
              type="text"
              className="border-2 shadow-lg p-2 mx-8 rounded-md"
              disabled
              value={username}
            />
          </div>
          <button
            onClick={handleSendMoney}
            className="p-2 bg-black mx-8 text-white mt-8 mb-4 cursor-pointer hover:bg-gray-800 font-semibold rounded-md transition-all duration-500 shadow-lg"
          >
            Send Money
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendMoney;
