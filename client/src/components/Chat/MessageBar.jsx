import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";

import { BsEmojiSmile } from "react-icons/bs"
import { ImAttachment } from "react-icons/im"
import { MdSend } from "react-icons/md";
import axios from "axios"
import { ADD_IMAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react"
import PhotoPicker from "../common/PhotoPicker";
import { FaMicrophone } from "react-icons/fa";
import dynamic from "next/dynamic"


const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {

  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const emojiPickerRef = useRef(null)


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false)
        }
      }
    }

    document.addEventListener("click", handleOutsideClick)

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }

  }, [])


  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev += emoji.emoji)
  }


  const [message, setMessage] = useState("")

  const [isSending, setIsSending] = useState(false)



  const sendMessage = async () => {
    try {
      setIsSending(true)
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: message,
      })

      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      })

      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true
      })

      setMessage("")
    } catch (error) {
      console.log(error)
    } finally {
      setIsSending(false)
    }
  }


  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();

      formData.append("image", file)
      const response = await axios.post(ADD_IMAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id
        }
      });

      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        })

        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {


    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)

      }
    }

  }, [grabPhoto])



  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.length > 0 && !isSending) {
      sendMessage();
    } else {
      return;
    }
  };

  return (
    <div className="bg-panel-header-bacground h-20 px-4 flex items-center gap-6 relative">

      {
        !showAudioRecorder && (
          <>
            <div
              className="flex gap-6">
              <BsEmojiSmile
                className="text-panel-header-icon cursor-pointer text-l"
                title="Emoji"
                id="emoji-open"

                onClick={handleEmojiModal}
              />
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-24 left-16 z-40">
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
              )}
              <ImAttachment
                className="text-panel-header-icon cursor-pointer text-l"
                title="Attach File"
                onClick={() => setGrabPhoto(true)}
              />

            </div>
            <div className="w-full rounded-lg h-10 flex items-center">
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Type a message"
                className="bg-input-background text-sm focus:outline-none h-10 rounded-lg px-5 py-4 w-full text-white"
              />
            </div>
            <div className="flex w-10 items-center justify-center">

              <button>
                {
                  message.length ? (
                    <MdSend
                      onClick={() => {
                        if (!isSending) { sendMessage() }
                      }}
                      title="Send Message"
                      className="text-panel-header-icon cursor-pointer text-l"
                    />
                  ) : (
                    <FaMicrophone
                      title="Record"
                      onClick={() => setShowAudioRecorder(true)}
                      className="text-panel-header-icon cursor-pointer text-l"
                    />
                  )}

              </button>
            </div>
          </>
        )
      }
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && (
        <CaptureAudio hide={setShowAudioRecorder} />
      )}
    </div>
  )
}

export default MessageBar;
