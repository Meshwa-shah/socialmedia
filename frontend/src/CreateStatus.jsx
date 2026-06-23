import { useState, useRef } from "react";
import { toast } from "react-toastify";
import API from "./axios";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";

const gradients = [
  "from-pink-500 to-orange-500",
  "from-violet-500 to-indigo-500",
  "from-green-500 to-cyan-500",
  "from-yellow-500 to-red-500",
  "from-blue-500 to-purple-500"
];

const CreateStatus = () => {

  const nav = useNavigate();

  const [text, setText] =
    useState("");

  const [media, setMedia] =
    useState(null);

    const dragRef =
  useRef(null);

   const [color, setcolor] = useState("white");

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [taggedUsers,
    setTaggedUsers] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [results,
    setResults] =
    useState([]);

  const [position,
    setPosition] =
    useState({
      x: -10,
      y: 0
    });

  const [selectedGradient,
    setSelectedGradient] =
    useState(
      gradients[0]
    );

  function add(user, name){
    addTaggedUser(user);
    setSearch(name);
  }

  const searchUsers =
    async (query) => {

      try {

        const res =
          await API.get(
            `/users/search?q=${query}`
          );

        if (
          res.data.success
        ) {

          setResults(
            res.data.users
          );

        }

      } catch (error) {

        toast.error(
          "Failed to search users"
        );

      }

    };

  const handleMedia =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      setMedia(file);

      setPreview(
        URL.createObjectURL(file)
      );

    };

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "text",
          text
        );

         formData.append(
          "textcolor",
          color
        );

        formData.append(
          "taggedUsers",
          JSON.stringify(
            taggedUsers
          )
        );

        formData.append(
          "textPosition",
          JSON.stringify(
            position
          )
        );

        if (media) {

          formData.append(
            "media",
            media
          );

        }

        const res =
          await API.post(
            "/status/create",
            formData
          );

        if (
          res.data.success
        ) {

          toast.success(
            "Story uploaded"
          );

          nav("/feed");

        }else{
          toast.error(res.data.message);
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const addTaggedUser =
    (user) => {

      if (
        !taggedUsers.includes(
          user._id
        )
      ) {

        setTaggedUsers(
          (prev) => [
            ...prev,
            user._id
          ]
        );

      }

    };

  return (

    <div
      className="
        min-h-screen
        bg-[#09090B]
        text-white
        p-4
      "
    >

      <div
        className="
          max-w-xl
          mx-auto
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-5
          "
        >
          Create Story
        </h1>

        {/* STORY PREVIEW */}

        <div
          className={`
            relative
            h-[70vh]
            rounded-3xl
            overflow-hidden
            flex
            items-center
            justify-center
            bg-gradient-to-br
            ${!preview ? selectedGradient : ""}
          `}
        >

          {/* MEDIA */}

          {
            preview && (
              media?.type.startsWith(
                "video"
              ) ? (

                <video
                  src={preview}
                  controls
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <img
                  src={preview}
                  alt=""
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              )
            )
          }

          {/* DRAGGABLE TEXT */}

          <Draggable
  nodeRef={dragRef}
  position={position}
  onStop={(e, data) =>
    setPosition({
      x: data.x,
      y: data.y
    })
  }
>

            <div
             ref={dragRef}
              className="
                absolute
                text-white
                text-3xl
                font-bold
                cursor-move
                text-center
                px-4
              "
              style={{color: `${color}`}}
            >

              {
                text ||
                "Type here"
              }

            </div>

          </Draggable>

        </div>

        {/* TEXT INPUT */}

        <textarea
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Write something..."
          className="
            w-full
            mt-4
            h-24
            bg-[#111115]
            text-white
            p-4
            rounded-2xl
            outline-none
          "
        />

        {/* MEDIA PICKER */}

        <input
          type="file"
          accept="
            image/*,
            video/*
          "
          onChange={
            handleMedia
          }
          className="
            mt-4
            text-white
          "
        />

        {/* TAG PEOPLE */}

        <input
          type="text"
          className="
            mt-4
            w-full
            bg-[#111115]
            text-white
            p-3
            rounded-xl
            outline-none
          "
          placeholder="Tag people"
          value={search}
          onChange={(e) => {

            setSearch(
              e.target.value
            );

            searchUsers(
              e.target.value
            );

          }}
        />

        {
          search.length > 0 &&
          results.map(
            (user) => (

              <div
                key={user._id}
                onClick={() => add(user, user.username)
                }
                className="
                  mt-2
                  p-2
                  rounded-xl
                  bg-[#111115]
                  cursor-pointer
                "
              >
                {
                  user.username
                }
              </div>

            )
          )
        }

        {/* GRADIENT PICKER */}

        {
          !preview && (

            <div
              className="
                flex
                gap-3
                mt-4
              "
            >

              {
                gradients.map(
                  (
                    gradient,
                    index
                  ) => (

                    <button
                      key={index}
                      onClick={() =>
                        setSelectedGradient(
                          gradient
                        )
                      }
                      className={`
                        w-10
                        h-10
                        rounded-full
                        bg-gradient-to-br
                        ${gradient}
                      `}
                    />

                  )
                )
              }

            </div>

          )
        }
        <p className="mt-2 text-xl">Select text color</p>
        <input type="color" name="" id="" value={color} className="rounded-2xl" onChange={(e) => setcolor(e.target.value)} className="mt-1 w-10 h-10"/>

        {/* POST BUTTON */}

        <button
          onClick={
            handleSubmit
          }
          disabled={loading}
          className="
            w-full
            mt-5
            bg-violet-600
            text-white
            py-4
            rounded-2xl
          "
        >

          {
            loading
              ? "Uploading..."
              : "Post Story"
          }

        </button>

      </div>

    </div>

  );

};

export default CreateStatus;