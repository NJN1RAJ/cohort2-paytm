import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [amount, setAmount] = useState<string | null>(null);
  const [users, setUsers] = useState<
    | {
        _id: string;
        firstname: string;
        lastname: string;
        username: string;
      }[]
    | null
  >(null);
  const [filter, setFilter] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      await axios
        .get("http://localhost:3000/api/v1/account/balance", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setAmount(res.data.balance);
        })
        .catch(() => {
          toast.error("Something went wrong while fetching balance", {
            transition: Bounce,
            theme: "dark",
            position: "top-right",
            autoClose: 5000,
            draggable: true,
            pauseOnHover: true,
          });
        });
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((error) => {
          toast.error(
            error.response.message ||
              "Something went wrong while fetching users"
          );
        });
    };
    fetchUsers();
  }, [filter]);

  return (
    <>
      <div className="flex flex-col bg-slate-900 h-screen w-screen">
        <NavBar />
        <div className="flex flex-col">
          <div className=" text-white font-bold mx-8 mt-8 mb-4 text-xl">
            Your balance: <span className="font-semibold">Rs {amount}</span>
          </div>
          <div className="text-2xl font-semibold mx-8 text-white">Users</div>
          <input
            type="text"
            placeholder="Search for users..."
            className="mx-8 border-2 rounded-md p-2 text-white mt-4"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col mt-5 gap-4">
          {users?.length === 0 && (
            <div className="m-4 text-center text-white text-xl">
              No users added
            </div>
          )}
          {users?.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center rounded-2xl bg-slate-300 p-2 mx-8"
            >
              <div className="flex items-center ml-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center mr-2 font-bold bg-white">
                  <div className="text-black text-xl text-center">
                    {user.firstname[0]}
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  {user.firstname + " " + user.lastname}
                </div>
              </div>
              <button
                onClick={() =>
                  navigate("/send/" + user._id + "/" + user.username)
                }
                className="bg-black text-white rounded-md mr-4 p-2 cursor-pointer"
              >
                Send Money
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
