import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { ITweet } from "../components/timeline";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%; //Avatar input이 숨겨짐
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      //avatar라는 폴더에 유저ID로 사진을 업로드함
      //=>user가 새로운 이미지로 업로드할 때 덮어쓰기됨
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      //사진URL을 state에 할당해서 유저 이미지가 바뀜
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      //데이터베이스 인스턴스 전달+컬렉션 이름
      where("userId", "==", user?.uid),
      //조건에 맞는 tweets만 가져오도록 필터링 해줌
      //조건: 유저ID가 현재 로그인한 ID와 같은 tweet
      //firebase에 어떤 필터를 사용할지 알려줘야함 => firebase홈페이지에서 설정
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      //변수에 tweets내용과 만든날짜,유져ID,닉네임,사진 추가
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {/* 유저이미지 업로드 버튼 */}
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {/* input창은 숨김 */}
      <Name>
        {user?.displayName ? user.displayName : "Anonymous"};
        {/* 더 간략히 => {user?.displayName?? "Anonymous"} */}
        {/* user가 닉네임 있으면 보여주고, 없으면 anonymous보여줌 */}
        <Tweets>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))}
        </Tweets>
      </Name>
    </Wrapper>
  );
}
