import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {

const [{ userInfo, userContacts, onlineUsers }, dispatch] = useStateProvider();


useEffect(() => {
  const getContacts = async () => {
    try {
      if (userInfo && userInfo.id) {
          const { data: { users, onlineUsers } } = await axios(`${GET_INITIAL_CONTACTS}/${userInfo.id}`);
          if (users) dispatch({type: reducerCases.SET_USER_CONTACTS,userContacts: users})
          if (onlineUsers) dispatch({type: reducerCases.SET_ONLINE_USERS,onlineUsers: onlineUsers})
        }
    } catch (error) {
      console.log(error);
    }
  };


  getContacts();
}, [userInfo, dispatch]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {userContacts && userContacts.map((contact) => {
        return (<ChatLIstItem data={contact} key={contact.id}/>)
      })}
    </div>
  );
}

export default List;
