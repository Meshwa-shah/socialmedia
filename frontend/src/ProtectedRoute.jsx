import { Navigate } from "react-router-dom";
import {toast} from "react-toastify"
import useAuthStore from "./useAuthStore";
import cookies from "js-cookie";
import socket from "./socket/socket";
import { useEffect } from "react";

const ProtectedRoute = ({
  children,
}) => {

  const { user } = useAuthStore();
  const userId = cookies.get("userId");


  if (!userId) {
    toast.error("Please login or signup to continue");
    return <Navigate to="/login" />;
  }


  return children;
};

export default ProtectedRoute;