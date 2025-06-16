import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function NavBar() {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get("http://localhost:3000/api/v1/user/me", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setUser({
            id: res.data.user._id,
            username: res.data.user.username,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
          });
        })
        .catch((error) => {
          toast.error(
            error.response?.error?.message ||
              "Error occured while fetching user details"
          );
        });
    };
    fetchUser();
  }, []);

  return (
    <div className="p-4 text-white flex justify-between items-center border-b-2">
      <div className="font-semibold text-3xl">PayTM</div>
      <div className="flex items-center gap-3">
        <div className="text-xl">
          Hello, {user?.firstName + " " + user?.lastName}
        </div>
        <div className="bg-white flex justify-center items-center rounded-full h-12 w-12">
          <div className="text-2xl text-black font-bold">
            {user?.firstName[0]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
