// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7kuOGskn7GUHnwes4bph10rws0xS08KA",
  authDomain: "nwitter-reloaded-1f483.firebaseapp.com",
  projectId: "nwitter-reloaded-1f483",
  storageBucket: "nwitter-reloaded-1f483.appspot.com",
  messagingSenderId: "695412618678",
  appId: "1:695412618678:web:a3af891c69d38f81877d17",
};

// Initialize Firebase
//config 옵션을 통해서 app을 생성시킴
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//app에 대한 인증 서비스를 사용