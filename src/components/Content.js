import React from "react";
import { useHistory } from "react-router";
import "../style.css";

const Content = ({ item, userObj }) => {
    const history = useHistory();
    // const toggleChoiceMode = () => {
    //     const homeList = document.querySelector(".Home-list");
    // };

    const goToChoiceInfo = () => {
        history.push(`/detail/${item.id}`);
    };

    const term = (now, when) => {
        let gap = now - when;
        let days = Math.floor(gap / (1000 * 60 * 60 * 24));
        let hours = Math.floor(gap / (1000 * 60 * 60));
        let minutes = Math.floor((gap / (1000 * 60)) % 60);

        days = days < 10 ? "0" + days : days;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        if (Number(days) != -0) {
            return `${days}일 ${hours}시간 ${minutes}분 전`;
        } else if (Number(hours) !== 0) {
            return `${hours}시간 ${minutes}분 전`;
        } else {
            return `${minutes}분 전`;
        }
    };
    return (
        <section className="Content" onClick={goToChoiceInfo}>
            <div>{term(Date.now(), item.when)}</div>
            <div>작성자 {item.writer}</div>
            <div>{item.question}</div>
        </section>
    );
};

export default Content;
