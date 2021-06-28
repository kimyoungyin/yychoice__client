import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fb";
import "../style.css";
import Content from "../components/Content";
import AddForm from "../components/AddForm";
import Alert from "../components/Alert";

const Home = ({ userObj }) => {
    const [uploadMode, setUploadMode] = useState(false);
    const [choiceItems, setChoiceItems] = useState([]);
    const [question, setQuestion] = useState("");
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [attachment1, setAttachment1] = useState("");
    const [attachment2, setAttachment2] = useState("");
    const [floatingAlert, setFloatingAlert] = useState(false);
    const [floatingIngAlert, setFloatingIngAlert] = useState(false);
    const [filters, setFilters] = useState([]);
    const [filtering, setFiltering] = useState("");
    const [value, setValue] = useState("");
    const activated = document.querySelector(".active");

    useEffect(() => {
        dbService.collection("questions").onSnapshot((snapshot) => {
            const questions = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // let filtered = questions.filter(
            //     (question) => question.category === filtering
            // );
            // if (filtering === "") {
            //     filtered = questions;
            // }
            questions.sort((a, b) => {
                if (a.when > b.when) return -1;
                if (a.when < b.when) return 1;

                return 0;
            });
            setChoiceItems(questions);
        });

        dbService.collection("category").onSnapshot((snapshot) => {
            const categorys = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            categorys.sort();
            setFilters(categorys);
        });

        return () => {
            setChoiceItems([]);
            setFilters([]);
        };
    }, []);

    const toggleUpload = () => {
        setUploadMode((prev) => !prev);
    };

    const onFileChange = (event) => {
        const {
            target: { files, className },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            if (className === "AddForm-choice1Img") {
                setAttachment1(result);
            } else if (className === "AddForm-choice2Img") {
                setAttachment2(result);
            }
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment1 = () => {
        const file = document.querySelector(".AddForm-choice1Img");
        file.value = "";
        setAttachment1("");
    };

    const onClearAttachment2 = () => {
        const file = document.querySelector(".AddForm-choice2Img");
        file.value = "";
        setAttachment2("");
    };

    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "question") {
            setQuestion(value);
        } else if (name === "choice1") {
            setChoice1(value);
        } else if (name === "choice2") {
            setChoice2(value);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setUploadMode(false);
        setFloatingIngAlert(true);
        let attachment1Url = "";
        let attachment2Url = "";
        const attachmentRef1 = storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
        const attachmentRef2 = storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
        if (attachment1 !== "" && attachment2 !== "") {
            const response1 = await attachmentRef1.putString(
                attachment1,
                "data_url"
            );
            attachment1Url = await response1.ref.getDownloadURL();
            const response2 = await attachmentRef2.putString(
                attachment2,
                "data_url"
            );
            attachment2Url = await response2.ref.getDownloadURL();
        } else if (attachment1 !== "") {
            console.log("1만 빈칸 아님");
            const response1 = await attachmentRef1.putString(
                attachment1,
                "data_url"
            );
            attachment1Url = await response1.ref.getDownloadURL();
        } else if (attachment2 !== "") {
            console.log("2만 빈칸 아님");
            const response2 = await attachmentRef2.putString(
                attachment2,
                "data_url"
            );
            attachment2Url = await response2.ref.getDownloadURL();
        }

        const contentObj = {
            question: question,
            choice1: choice1,
            choice2: choice2,
            when: Date.now(),
            writer: userObj.displayName,
            photo: userObj.photo,
            attachment1Url,
            attachment2Url,
        };
        await dbService.collection("questions").add(contentObj);
        setQuestion("");
        setChoice1("");
        setChoice2("");
        setAttachment1("");
        setAttachment2("");
        setFloatingIngAlert(false);
        setFloatingAlert(true);
        setTimeout(() => setFloatingAlert(false), 3000);
    };

    const cancelAdd = () => {
        setUploadMode(false);
    };

    const onChangeFilter = (e) => {
        const {
            target: { value },
        } = e;
        setValue(value);
    };

    const getFilter = (e) => {
        const {
            target: { innerText, className },
        } = e;
        if (className === "Home-categoryBtn") {
            if (activated !== null) {
                activated.classList.remove("active");
            }
            setFiltering(innerText);
            e.target.classList.add("active");
        } else if (className === "Home-categoryBtn active") {
            setFiltering("");
            e.target.classList.remove("active");
        }
    };

    return (
        <div className="Home">
            {!uploadMode ? (
                <>
                    <h2 className="Home-tip">
                        선택에 참여하여 고민하는 사람들을 도와주세요!
                    </h2>
                    <nav className="Home-category">
                        {false && (
                            <>
                                <label htmlFor="filter">카테고리 찾기</label>
                                <input
                                    id="filter"
                                    type="text"
                                    value={value}
                                    onChange={onChangeFilter}
                                />
                            </>
                        )}
                        <div className="Home-categoryList">
                            {filters.map((filter) => (
                                <button
                                    className="Home-categoryBtn"
                                    key={filter.id}
                                    onClick={getFilter}
                                >
                                    {filter.text}
                                </button>
                            ))}
                        </div>
                    </nav>
                    <div className="Home-list">
                        {choiceItems.map((item) => {
                            if (filtering === "") {
                                return (
                                    <Content
                                        key={item.id}
                                        item={item}
                                        userObj={userObj}
                                    />
                                );
                            } else {
                                return (
                                    item.category === filtering && (
                                        <Content
                                            key={item.id}
                                            item={item}
                                            userObj={userObj}
                                        />
                                    )
                                );
                            }
                        })}
                    </div>
                    <button className="Home-button" onClick={toggleUpload}>
                        +
                    </button>
                </>
            ) : (
                <AddForm
                    onChange={onChange}
                    onSubmit={onSubmit}
                    choice1={choice1}
                    choice2={choice2}
                    cancelAdd={cancelAdd}
                    onFileChange={onFileChange}
                    attachment1={attachment1}
                    attachment2={attachment2}
                    onClearAttachment1={onClearAttachment1}
                    onClearAttachment2={onClearAttachment2}
                />
            )}
            {floatingAlert && <Alert text="업로드 완료" />}
            {floatingIngAlert && <Alert text="업로드 중.." />}
        </div>
    );
};

export default Home;
