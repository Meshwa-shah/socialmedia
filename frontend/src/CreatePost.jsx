import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Image,
  X,
} from "lucide-react";

import API from "./axios";

const CreatePost = () => {

  const nav = useNavigate();

  const [caption, setCaption] =
    useState("");

  const [media, setMedia] =
    useState([]);

  console.log(media);

  const [previews, setPreviews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // HANDLE MEDIA

  const handleMedia = (e) => {

    const files = Array.from(
      e.target.files
    );

    if (!files.length) return;

    const totalFiles =
      media.length + files.length;

    if (totalFiles > 5) {

      toast.error(
        "Maximum 5 files allowed"
      );

      return;
    }

    const previewUrls =
      files.map((file) => ({
        url: URL.createObjectURL(file),
        type:
          file.type.startsWith("video")
            ? "video"
            : "image",
      }));

    setMedia((prev) => [
      ...prev,
      ...files,
    ]);

    setPreviews((prev) => [
      ...prev,
      ...previewUrls,
    ]);
  };

  // REMOVE MEDIA

  const removeMedia = (index) => {

    const updatedMedia =
      media.filter(
        (_, i) => i !== index
      );

    const updatedPreviews =
      previews.filter(
        (_, i) => i !== index
      );

    setMedia(updatedMedia);

    setPreviews(
      updatedPreviews
    );
  };

  // SUBMIT POST

  const handleSubmit = async () => {

    if (!media.length) {

      toast.error(
        "Please select media"
      );

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "caption",
        caption
      );

      media.forEach((file) => {

        formData.append(
          "media",
          file
        );

      });

      const res = await API.post(
        "/posts/create",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (
        res.data.success === true
      ) {

        toast.success(
          res.data.message
        );

        setCaption("");

        setMedia([]);

        setPreviews([]);

        nav("/feed");

      } else {

        toast.error(
          res.data.message
        );

      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to upload post"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className=" bg-[#09090B] flex justify-center px-4 py-10 relative overflow-hidden">

      {/* GLOW */}

      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-violet-700/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-700/20 rounded-full blur-3xl"></div>

      {/* CARD */}

      <div className="relative z-10 w-full max-w-2xl bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 md:p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)]">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Create Post
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Share your moments with the community
          </p>

        </div>

        {/* CAPTION */}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) =>
            setCaption(
              e.target.value
            )
          }
          className="w-full h-32 bg-[#1A1A22] border border-[#2A2A35] rounded-2xl p-5 text-white outline-none resize-none placeholder:text-gray-500"
        />

        {/* MEDIA PREVIEW */}

        {
          previews.length > 0 && (

            <div className="mt-6 grid grid-cols-2 gap-4">

              {
                previews.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="relative"
                    >

                      <button
                        onClick={() =>
                          removeMedia(
                            index
                          )
                        }
                        className="absolute top-3 right-3 z-20 bg-black/60 p-2 rounded-full"
                      >
                        <X size={18} />
                      </button>

                      {
                        item.type ===
                          "image" ? (

                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-64 object-cover rounded-3xl border border-white/10"
                          />

                        ) : (

                          <video
                            src={item.url}
                            controls
                            className="w-full h-64 rounded-3xl border border-white/10"
                          />

                        )
                      }

                    </div>

                  )
                )
              }

            </div>

          )
        }

        {/* UPLOAD */}

        <div className="mt-6">

          <label className="cursor-pointer bg-[#1A1A22] border border-[#2A2A35] rounded-2xl p-5 flex items-center justify-center gap-3 hover:border-violet-500 transition-all">

            <Image size={22} />

            <span className="text-gray-300">
              Upload Media (Max 5)
            </span>

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={
                handleMedia
              }
            />

          </label>

        </div>

        {/* BUTTON */}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:opacity-90 transition-all"
        >
          {
            loading
              ? "Posting..."
              : "Publish Post"
          }
        </button>

      </div>

    </div>
  );
};

export default CreatePost;