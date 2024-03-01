import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {

  const [{ currentChatUser, userInfo }, dispatch] = useStateProvider()
  const [audioMessage, setAudioMessage] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)

  const waveFormRef = useRef(null)
  const waveForm = useRef(null)


  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime)
      }
      audioMessage.addEventListener("timeupdate", updatePlaybackTime)

      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime)
      }
    }
  }, [audioMessage])

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.stop();
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  }


  useEffect(() => {
    if (message.message) {
      const audioURL = `${HOST}/${message.message}`;
      const audio = new Audio(audioURL);

      setAudioMessage(audio);

      if (waveForm.current) {
        waveForm.current?.load(audioURL);
        waveForm.current.on("ready", () => {
          setTotalDuration(waveForm.current.getDuration());
        });
      }
    }
  }, [message.message, waveForm.current]);

  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      })

    }

    waveForm.current.on("finish", () => {
      setIsPlaying(false)
    })

    return () => {
      waveForm.current.destroy();
    }

  }, [])



  const formatTime = (time) => {
    if (isNaN(time)) return "00:00"

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }


  const handlePauseAudio = () => {
    waveForm.current.stop();
    audioMessage.pause();
    setIsPlaying(false);
  }
  return (
    <div className={`
   flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}
  `}>
      <div>
        <Avatar type={"lg"} image={currentChatUser?.profilePicture} />
      </div>
      <div className="cursor-pointer text-xl">
        {
          !isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />
        }
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef}></div>
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-25px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1 items-center justify-center">
            <span>
              {calculateTime(message.createdAt)}
            </span>
            <span>
              {
                message.senderId === userInfo.id && (
                  <MessageStatus status={message.messageStatus} />
                )
              }
            </span>
          </div>
        </div>
      </div>
    </div>);
}

export default VoiceMessage;
