import {
  useEffect,
  useState
} from "react";

import API from "./axios";
import {
  useNavigate
} from "react-router-dom";

const LikedPosts = () => {

  const nav =
    useNavigate();

  const [posts,
    setPosts] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  console.log(posts)

  const fetchLikedPosts =
    async () => {

      try {

        const res =
          await API.get(
            "/posts/liked"
          );

        if (
          res.data.success
        ) {

          setPosts(
            res.data.posts
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchLikedPosts();

  }, []);

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-[#09090B]
        text-white
        flex
        items-center
        justify-center
      ">
        Loading...
      </div>
    );

  }

  return (

    <div className="
      min-h-screen
      bg-[#09090B]
      text-white
      px-4
      py-6
    ">

      <div className="
        max-w-4xl
        mx-auto
      ">

        <h1 className="
          text-3xl
          font-bold
          mb-8
        ">
          Liked Posts
        </h1>

        {
          posts.length === 0 ? (

            <p className="
              text-gray-400
            ">
              No liked posts yet
            </p>

          ) : (

            <div className="
              grid
              grid-cols-3
              gap-4
            ">

              {
                posts.map(
                  (post) => (
                    post.media?.[0]?.mediaType === "image" ? <>

                      <img
                        key={post._id}
                        src={
                          post.media?.[0]?.url
                        }
                        alt=""
                        onClick={() =>
                          nav(
                            `/posts/${post._id}`
                          )
                        }
                        className="
                        w-full
                        h-64
                        object-cover
                        rounded-xl
                        cursor-pointer
                      "
                      /></> : <><video
                        key={post._id}
                        src={
                          post.media?.[0]?.url
                        }
                        alt=""
                        onClick={() =>
                          nav(
                            `/posts/${post._id}`
                          )
                        }
                        className="
                        w-full
                        h-64
                        object-cover
                        rounded-xl
                        cursor-pointer
                      "
                      /></>

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

export default LikedPosts;