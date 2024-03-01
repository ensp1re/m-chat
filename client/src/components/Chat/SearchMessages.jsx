import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {

  

  const [{currentChatUser, messages}, dispatch] = useStateProvider()
  const [searchedMessages, setSearchedMessages] = useState("")
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    if (searchTerm) {
      setSearchedMessages(messages.filter((message) => message.type === "text" && message.message.includes(searchTerm)))
    } else {
      setSearchedMessages("")
    }
  }, [searchTerm])

  return (<div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
    <div className="h-16 px-4 py-5 flex gap-10 items0center bg-panel-header-background text-primary-strong">
      <IoClose
      onClick={() => dispatch({type: reducerCases.SET_MESSAGE_SEARCH})}
      className="cursor-pointer text-icon-lighter text-2xl"/>
      <span>
        Search Messages
      </span>
    </div>
    <div className="overflow-auto custom-scrollbar h-full">
      <div className="flex items-center flex-col w-full">
        <div className="flex px-5 items-center gap-3 h-14 w-full ">
        <div className="bg-panel-header-background flex items-center gap-5 px-4 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
        </div>
        <div>
          <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Messages"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          // onChange={}
          />
        </div>
      </div>
        </div>
      <span className="mt-10 text-secondary">
      {!searchTerm.length && `Search for messages with ${currentChatUser.name}`}
      </span>
      </div>
      <div className="flex justify-center h-full flex-col ">
        {
          searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>  
          )
        }
        <div className="flex flex-col w-full h-full">
          {searchedMessages.length > 0 &&
          searchedMessages.map((message) => (
          <div
            key={message.id} 
            className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5"
          >
            <div className="text-sm text-secondary">
              {calculateTime(message.createdAt)}
            </div>
            <div className="text-icon-green">{message.message}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  </div>);
}

export default SearchMessages;
