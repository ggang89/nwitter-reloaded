// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SOME_API_KEY,
  authDomain: "nwitter-reloaded-1f483.firebaseapp.com",
  projectId: "nwitter-reloaded-1f483",
  storageBucket: "nwitter-reloaded-1f483.appspot.com",
  messagingSenderId: "695412618678",
  appId: import.meta.env.VITE_SOME_APP_ID,
};

// Initialize Firebase
//config 옵션을 통해서 app을 생성시킴
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//app에 대한 인증 서비스를 사용

//데이터베이스와 스토리지에 대한 액세스 권한을 얻음
//addDoc(collection())에서 firebase 인수로도 사용함
export const storage = getStorage(app);

export const db = getFirestore(app);
