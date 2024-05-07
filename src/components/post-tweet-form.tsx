import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const maxFileSize = 1024 * 1024; //1MB
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size < maxFileSize) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      //addDoc: 새로운 document 생성 함수
      //1.어떤 컬렉션에 document 생성할지 지정(twwets, users, comments..)
      //2.collection은 최소 2개이 상의 firebase 인수가 필요하다 + 이름
      //=>tweets 컬렉션에 document추가
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(), //트윗이 생성된 시간 알 수 있음
        username: user.displayName || "Anonymous",
        userId: user.uid,
        //트윗 삭제를 위해서 사용자의 ID를 저장해야함
        //트윗 삭제하려는 유저의 ID와 저장된 userId가 일치하는지 확인필요
      });
      if (file) {
        //파일이 업로드 되면 파일 위치에 대한 reference를 받아야 함
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        //tweets폴더 안에 각 유저들의 폴더 생성해서 그 안에 이미지 저장함
        const result = await uploadBytes(locationRef, file);
        //파일을 저장할 위치를 uploadBytes함수에 알려줌
        const url = await getDownloadURL(result.ref);
        //getDownloadURL 함수 : result의 퍼블릭 URL을 반환함
        //결과값은 string을 반환하는 promise함
        await updateDoc(doc, {
          photo: url,
        });
        //document를 업데이트 해줘야함 => 사진URL저장
        //첫번째 인수 => 업데이트하고 싶은 문서에 대한 참조
        //두번째 인수 => 업데이트하고 싶은 데이터
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?!"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
