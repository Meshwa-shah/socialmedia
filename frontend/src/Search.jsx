import {
  useState,
} from "react";

import API from "./axios";
import { toast } from 'react-toastify';

import {
  Link,
} from "react-router-dom";

const Search = () => {

  const [query,
    setQuery] =
    useState("");

  const [users,
    setUsers] =
    useState([]);

  const searchUsers =
    async (value) => {

      setQuery(value);

      const res =
        await API.get(
          `/users/search?q=${value}`
        );
      if (res.data.success === true) {

        setUsers(
          res.data.users
        );
      }
      else {
        toast.error("something went wrong");
      }

    };

  return (

    <div className=" bg-[#09090B] p-4">

      <input
        value={query}
        onChange={(e) =>
          searchUsers(
            e.target.value
          )
        }
        placeholder="Search users..."
        className="w-full bg-[#111115] p-4 rounded-2xl text-white"
      />

      <div className="mt-6 space-y-3">

        {query.length > 0 && users.map(
          (user) => (

            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex items-center gap-3 bg-[#111115] p-3 rounded-xl"
            >

              <img
                src={
                  user.profilePic
                }
                alt=""
                className="w-12 h-12 rounded-full"
              />

              <span className="text-white">

                {user.username}

              </span>

            </Link>

          )
        )}

      </div>

    </div>

  );

};

export default Search;