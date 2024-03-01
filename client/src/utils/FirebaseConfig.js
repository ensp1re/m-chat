import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAnO1e-V0-BHeyDG3ZCWCweifMohFYtUPQ",
    authDomain: "m-chat-529a8.firebaseapp.com",
    projectId: "m-chat-529a8",
    storageBucket: "m-chat-529a8.appspot.com",
    messagingSenderId: "619744580225",
    appId: "1:619744580225:web:dd6f4ed03a3f787d84b380",
    measurementId: "G-QF2KPBQ9PW"
};

const app = initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(app)