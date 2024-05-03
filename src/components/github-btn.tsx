import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 600;
  width: 100%;
  color: black;
  padding: 10px 20px;
  baorder-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-item: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      //2가지 옵션 존재
      //=>팝업창으로 로그인 화면 뜸
      //await signInWithRedirect(auth,provider);
      //=> 깃 페이지로 화면이 이동됨
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}
