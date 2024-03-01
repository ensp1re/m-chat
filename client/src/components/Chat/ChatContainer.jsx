import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic"


const VoiceMessage = dynamic(() => import("./VoiceMessage"), {
  ssr: false
});


function ChatContainer() {


  const chatEndRef = useRef(null)


  const [{ messages, currentChatUser, userInfo }] = useStateProvider();


  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" , block: "end"});
    }
  }, [messages]);


  return (
    <div className="h-[80vh] relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0">

      </div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {
              messages && messages?.map((message, index) => {
                return (
                  <div
                    className={`flex ${message.senderId === currentChatUser?.id ? "justify-start" : "justify-end"}`}
                    key={message.id}>
                    {
                      message.type === "text" && (
                        <div className={`
                      text-white px-2 py-[5px] text-sm rounded-sm flex gap-2 items-end max-w-[50%]
                      ${message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"} `}>
                          <span className="break-all">{message.message}</span>
                          <div className="flex gap-1 items-end">
                            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                              {calculateTime(message.createdAt)}
                            </span>
                            <span>
                              {
                                message.senderId === userInfo?.id && (
                                  <MessageStatus status={message.messageStatus} />
                                )
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    {
                      message.type === "image" && (
                        <ImageMessage
                          message={message}
                        />
                      )
                    }
                    {
                      message.type === "audio" && (
                        <VoiceMessage message={message} />
                      )
                    }

                  </div>
                )
              })
            }
            <div ref={chatEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
