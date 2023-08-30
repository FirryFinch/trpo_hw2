import React from 'react';
import {Link} from "react-router-dom";

import './Error.css';

import BlueButton from "../components/buttons/BlueButton";

function Error() {
    return (
        <>
            <div className={'center_position'}>
                <div className={'oops_text'}>
                    Упс!
                </div>
                <div className={'space56'}/>
                <div className={'error_text'}>
                    Возникла ошибка 😞
                </div>
                <div className={'space56'}/>
                <div className={'error_text'} style={{ color: "#929292" }}>
                    <i>
                        404
                        <br/>
                        <br/>
                        Страница не найдена
                    </i>
                </div>
                <div className={'space56'}/>
                <Link to="/">
                    <BlueButton style={{ width: "100%" }}>
                        На главную
                    </BlueButton>
                </Link>
            </div>
        </>
);
}

export default Error;