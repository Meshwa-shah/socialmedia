import {
  useEffect,
  useState,
} from "react";
import { toast } from 'react-toastify'
import API from "./axios";
import Cookies from 'js-cookie';
import { Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {

  const [user, setUser] =
    useState(null);

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [disabled, setdisabled] = useState(false);

  const id = Cookies.get("userId");
  const nav = useNavigate();
  const { profile } = useParams();

  console.log(user);

  const startChat =
  async () => {

    try {

      const res =
        await API.post(
          `/chat/conversation/${user._id}`
        );

      if (
        res.data.success === true 
      ) {

        nav(
          `/messages/${res.data.conversation._id}`
        );

      }else{
        toast.error("something went wrong");
      }

    } catch (error) {

      console.log(error);

    }

  };
  

  const handleFollow = async () => {  try {
    setdisabled(true)

      const res =
        await API.put(
          `/users/follow/${profile}`
        );

      if (
        res.data.success === true
      ) {
        toast.success(res.data.message)

        fetchProfile();

      }
      else{
        toast.error(res.data.message);
      }

    } catch (error) {

      toast.error(error);

    }
    finally{
      setdisabled(false)
    }
}

  const fetchProfile =
    async () => {

      try {

        const res =
          await API.get(
            `/users/me/${profile}`
          );
        if (res.data.success === true) {

          setUser(
            res.data.user
          );

          setPosts(
            res.data.posts
          );
        }
        else {
          toast.error("something went wrong");
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchProfile();

  }, []);

  const isFollowing =
  user?.followers?.some(
    follower =>
      follower._id === id
  );

  if (loading) {

    return (
      <div className=" bg-[#09090B] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  }

  return (

    <div className=" bg-[#09090B] text-white">

      {/* HEADER */}

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="flex flex-col md:flex-row gap-8 items-center">

          {/* PROFILE PIC */}

          <img
            src={
              user.profilePic ||
              "https://placehold.co/200"
            }
            alt=""
            className="
              w-36
              h-36
              rounded-full
              object-cover
              border-4
              border-violet-500
            "
          />

          {/* INFO */}

          <div>

            <h1 className="text-3xl font-bold">

              {user.username}

            </h1>

            <p className="text-gray-400 mt-2">

              {user.bio ||
                "No bio yet"}

            </p>

            {/* STATS */}

            <div className="flex gap-8 mt-5">

              <div>

                <h3 className="font-bold text-xl">

                  {posts.length}

                </h3>

                <p className="text-gray-400">

                  Posts

                </p>

              </div>

              <div onClick={() => nav(`/follower/${profile}`)}>

                <h3 className="font-bold text-xl">

                  {
                    user.followers
                      .length
                  }

                </h3>

                <p className="text-gray-400" >

                  Followers

                </p>

              </div>

              <div onClick={() => nav(`/following/${profile}`)}>

                <h3 className="font-bold text-xl">

                  {
                    user.following
                      .length
                  }

                </h3>

                <p className="text-gray-400">

                  Following

                </p>

              </div>

            </div>

            {/* EDIT BUTTON */}
            <div className="flex mt-6 gap-3">

            <button
              className="
                
                px-6
                py-3
                rounded-xl
                bg-violet-600
                hover:bg-violet-700
              "
              onClick={() => {
                if (user._id === id) {
                  nav(`/edit/${id}`);
                } else {
                  handleFollow();
                }
              }}
              disabled={disabled}
            >
              {user._id === id ? "Edit Profile" : isFollowing ? "Unfollow" : "Follow"}
            </button>
            {user._id === id ? <> 
             <button
              className="
                
                px-6
                py-3
                rounded-xl
                bg-violet-600
                hover:bg-violet-700
              "
              onClick={() => {
             
                  nav(`/create-story`);
                
              }}
            >
              Upload story
            </button></>  : <><button
              className="
                
                px-6
                py-3
                rounded-xl
                bg-violet-600
                hover:bg-violet-700
              "
              onClick={() => {
             
                  startChat()
                
              }}
            >
              Chat
            </button></>}
            {user._id === id && <button className="
                
                px-6
                py-3
                rounded-xl
                bg-violet-600
                hover:bg-violet-700
              " onClick={() => nav(`/liked-posts`)}>
                <Heart size={20}/>
              </button>}
            </div>

          </div>

        </div>

      </div>

      {/* POSTS GRID */}

      <div className="max-w-5xl mx-auto px-4 pb-10">

        <h2 className="text-xl font-semibold mb-5">

          Posts

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          {
            posts.map(
              (post) => (

                <div
                  key={
                    post._id
                  }
                  className="
                    aspect-square
                    overflow-hidden
                    rounded-2xl
                    bg-[#111115]
                  "
                  onClick={() => nav(`/posts/${post._id}`)}
                >

                  {
                    post
                      .media?.[0]
                      ?.mediaType ===
                      "video" ? (

                      <video
                        src={
                          post
                            .media[0]
                            .url
                        }
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    ) : (

                      <img
                        src={
                          post
                            .media[0]
                            .url
                        }
                        alt=""
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    )
                  }

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  );

};

export default Profile;