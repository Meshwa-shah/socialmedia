import { Outlet } from "react-router-dom";
import useAuthStore from "./useAuthStore";
import Cookies from "js-cookie";
import socket from "./socket/socket";
import { useEffect } from "react";

import Topbar from "./Topbar";

import BottomNav from "./BottomNav";


const AppLayout = () => {
  const { user } = useAuthStore();
  console.log(user);

  useEffect(() => {

    const userId =
      Cookies.get("userId");

    if (userId) {

      socket.emit(
        "join",
        userId
      );

      console.log(
        "Joining room:",
        userId
      );

    }

  }, []);

  return (
    <div className="h-screen bg-[#09090B] text-white overflow-hidden ">

      <Topbar />

      <main
        className="
          absolute
          top-[75px]
          bottom-[75px]
          left-0
          right-0
          overflow-y-auto
          no-scrollbar
        "
      >
        <Outlet />
      </main>

      <BottomNav />

    </div>
  );
};

export default AppLayout;