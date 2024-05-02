//로그인한 사용자는 protected route를 볼 수 있고,
//로그인 안한 사용자는 로그인,계정생성페이지로 가게됨
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  //ProtectedRoute는 다른 모든 react component처럼 children을 가진다
  children,
}:{
  children:React.ReactNode;
}){
  const user = auth.currentUser;
  //auth.currentUser => user의 로그인 여부 확인(firebase에 user정보요청)
  //로그인 된 user의 값을 주거나 null값을 반환
  if(user === null){
    return <Navigate to="/login" />;
    //user 값이 없으면 login 페이지로 이동
  }
  return children;
  //user 값이 있으면 children 반환
}