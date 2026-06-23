import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";

import API from "./axios";



const Following = () => {
    const nav = useNavigate();

  const { userId } =
    useParams();

  const [followers,
    setfollowers] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

console.log(followers)

  const fetchfollower =
    async () => {

      try {

        const res =
          await API.get(
            `/users/following/${userId}`
          );

        if (
          res.data.success
        ) {

          setfollowers(
            res.data.following
          );

        }

      } catch (error) {

        toast.error(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchfollower();

  }, []);

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          bg-[#09090B]
          text-white
          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );

  }

  

  return (

    <div
      className="
        min-h-screen
        bg-[#09090B]
        text-white
        px-4
        py-6
      "
    >

      <div
        className="
          max-w-2xl
          mx-auto
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
         Following
        </h1>

        {
          followers.length <= 0 ? (
            <p
              className="
                text-gray-400
              "
            >
              No following yet
            </p>

          ) : (

            <div
              className="
                space-y-4
              "
            >

              {
                followers.map(
                  (
                    reaction,
                    i
                  ) => (

                    <div
                      key={i}
                      className="
                        flex
                        items-center
                        gap-4
                        p-4
                        rounded-2xl
                        bg-[#111115]
                      "
                    >

                      <img
                        src={
                          reaction?.profilePic
                        }
                        alt=""
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                        "
                      />

                      <div>

                        <p
                          className="
                            font-semibold
                          "
                        >
                          {
                            reaction?.username
                          }
                        </p>

                       <button className="text-violet-400" onClick={() => nav(`/profile/${reaction._id}`)}>
                        check profile
                       </button>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

};

export default Following;