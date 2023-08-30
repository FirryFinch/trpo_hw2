import '../../General.css';
import './GlobalHeader.css';

import OrangeButton from "../buttons/OrangeButton";

function GlobalHeader ({username, firstname, lastname, group, logout, onUploadClicked, onHomeClicked}) {

    const UploadButton = () => {
        return(
            <div className={'upload'} onClick={onUploadClicked}/>
        )
    }

    if (!username)
    {
        username = ""
    }

    if (firstname)
    {
        firstname = firstname.charAt(0) + "."
    }
    else
    {
        firstname = ""
    }

    if (!lastname)
    {
        lastname = username.charAt(0).toUpperCase() + username.slice(1)
    }

    let upload_button;

    if (group === 'user')
    {
        group = 'Пользователь'
    }
    if (group === 'admin')
    {
        group = 'Администратор'
        upload_button = <UploadButton/>
    }

    return (
        <div className={'genframe_position'}>
            <div className={'bauman'}/>
            <div className={'step'}/>
            <h3 style={{ fontWeight: 600}}>
                Облака точек кафедры ИУ5
            </h3>
            <div style={{ marginLeft:'auto' }}/>
            {upload_button}
            <div className={'step'}/>
            <div className={'home'} onClick={onHomeClicked}/>
            <div className={'step'}/>
            <h5>
                {lastname} {firstname}
                <br/>
                <div style={{ color:'#9F9F9F'}}>
                    {group}
                </div>
            </h5>
            <div className={'step'}/>
            <OrangeButton style={{ width: "17vh" /*115 px*/, height: "6.5vh" /*43.875 px*/ }} onClick={logout}>
                Выйти
            </OrangeButton>
        </div>
    );
}

export default GlobalHeader;