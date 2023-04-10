import Content from "components/Content";
import customAixos from "customAixos";
import { useEffect, useState } from "react";
import { Item } from "routes/ChoiceInfo";

const Profile = ({ userObj }: { userObj: global.User }) => {
    const [writed, setWrited] = useState(0);
    const [writedData, setWritedData] = useState<Item[]>([]);

    useEffect(() => {
        const getUserPost = async () => {
            try {
                const { data } = await customAixos.get(`/posts/profile`);
                console.log(data);
                setWrited(data.length);
                setWritedData(data);
            } catch (error) {
                console.log(error);
            }
        };
        getUserPost();
    }, []);

    return (
        <div className="Profile">
            <h2 className="Profile-title">DASHBOARD</h2>
            <h2 className="Profile-mail">
                오류 및 개선사항 문의 :{" "}
                <a href="mailto:yin199859@gmail.com">yin199859@gmail.com</a>
            </h2>
            <div className="Profile-userInfo">
                <img src={userObj.photoUrl} alt="없음" />
                <div className="Profile-text">
                    <div>닉네임 : {userObj.displayName}</div>
                    <div>업로드 : {writed}회</div>
                </div>
            </div>
            <h3 className="Profile-myTitle">MY QUESTIONS</h3>
            <div className="Profile-questions">
                {writedData.map((item) => (
                    <Content key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Profile;
