import React, {useRef, useState} from 'react';

import './UploadBlock.css';

import BlueButton from "../components/buttons/BlueButton";
import RedButton from "../components/buttons/RedButton";

const UploadBlock = ({user_id, csrf, toMain}) => {

    const [drag, setDrag] = useState('false');

    const [file, setFile] = useState();
    const [subclasses, setSubclassesList] = useState(['']);

    const [numericLength, setNumericLength] = useState(['']);
    const [numericWidth, setNumericWidth] = useState(['']);
    const [numericHeight, setNumericHeight] = useState(['']);
    const [numericNum, setNumericNum] = useState(['']);


    function getSubclassesList () {
        fetch("api/get-subclasses/", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setSubclassesList(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function dragStartHandler(event){
        event.preventDefault()
        setDrag('true')
    }

    function dragLeaveHandler(event){
        event.preventDefault()
        setDrag('false')
    }

    function onDropHandler(event){
        function splitter(filename){
            return filename.split('.').pop();
        }

        event.preventDefault()

        if (splitter(event.dataTransfer.files[0].name) === 'las'){
            setDrag('form')
            getSubclassesList()
            setFile(event.dataTransfer.files[0])
        }
        else
        {
            setDrag('oops')
        }
    }

    const inputFile = useRef(null)

    const onClickHandler = () => {
        inputFile.current.click();
    };

    function uploadClickHandler(event){
        setFile(event.target.files[0])
        setDrag('form')
        getSubclassesList()
    }

    function uploadAgain(){
        setDrag('false')
        setFile('')
    }

    const handleNumericLength = event => {
        const result = event.target.value.replace(/\D/g, "");
        setNumericLength(result);
    };

    const handleNumericWidth = event => {
        const result = event.target.value.replace(/\D/g, "");
        setNumericWidth(result);
    };

    const handleNumericHeight = event => {
        const result = event.target.value.replace(/\D/g, "");
        setNumericHeight(result);
    };

    const handleNumericNum = event => {
        const result = event.target.value.replace(/\D/g, "");
        setNumericNum(result);
    };


    const handleFormSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('subcl', event.target.fsubcl.value)
        formData.append('name', event.target.fname.value)
        formData.append('length', event.target.flength.value)
        formData.append('width', event.target.fwidth.value)
        formData.append('height', event.target.fheight.value)
        formData.append('file', file)
        formData.append('num', event.target.fnum.value)
        formData.append('created_by', user_id)

        fetch("api/add-object/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrf
            },
            credentials: "include",
            body: formData
        })
            .then(() => {
                setDrag('success')
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
            <>
                {drag === 'true' &&
                    <div className="upload_parent"
                         onDragStart={event => dragStartHandler(event)}
                         onDragLeave={event => dragLeaveHandler(event)}
                         onDragOver={event => dragStartHandler(event)}
                         onDrop={event => onDropHandler(event)}>
                        <div className="upload_child">
                            <div className="file_image"/>
                            <div className="space20"/>
                            Отпустите файл для загрузки
                        </div>
                    </div>
                }
                {drag === 'false' &&
                    <>
                    <div className="upload_parent"
                         onDragStart={event => dragStartHandler(event)}
                         onDragLeave={event => dragLeaveHandler(event)}
                         onDragOver={event => dragStartHandler(event)}
                         onClick={onClickHandler}>
                        <div className="upload_child">
                            <div className="upload_image"/>
                            <div className="space20"/>
                            Перетащите файл в это поле или нажмите на иконку, чтобы выбрать файл
                        </div>
                        <input type='file' id='file' style={{display: "none"}} ref={inputFile} onChange={uploadClickHandler} accept=".las"/>
                    </div>
                    </>
                }
                {drag === 'form' &&
                    <div className="upload_parent">
                        <div className="upload_child" style={{width: '50%'}}>
                            <div className={'space20'}/>
                            <div style={{display: "flex", height: '6vh', alignItems: 'center'}}>
                                <label style={{marginRight: "1%"}}>Загруженный файл:</label>
                                <label style={{color: "black"}}>{file.name}</label>
                                <RedButton style={{width: "25%", height: '6vh', marginLeft:'auto'}} onClick={uploadAgain}>Заменить</RedButton>
                            </div>
                            <div className={'space20'}/>
                            <div className='textBefore'>
                                Файл необходимо привязать к объекту. Заполните поля ниже.
                            </div>
                            <div className={'space20'}/>
                            <form onSubmit={handleFormSubmit}>
                                <label>Название</label>
                                <br></br>
                                <input
                                    maxLength="50"
                                    className={'formInput'}
                                    name='fname'></input>
                                <br></br>
                                <div className={'space20'}/>

                                <label>Подкласс</label>
                                <br></br>
                                <select name='fsubcl'>
                                    {subclasses.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
                                </select>
                                <br></br>
                                <div className={'space20'}/>

                                <label>Длина</label>
                                <br></br>
                                <input maxLength="6" className={'formInput'} name='flength' value={numericLength} onChange={handleNumericLength}></input>
                                <br></br>
                                <div className={'space20'}/>

                                <label>Ширина</label>
                                <br></br>
                                <input maxLength="6" className={'formInput'} name='fwidth' value={numericWidth} onChange={handleNumericWidth}></input>
                                <br></br>
                                <div className={'space20'}/>

                                <label>Высота</label>
                                <br></br>
                                <input maxLength="6" className={'formInput'} name='fheight' value={numericHeight} onChange={handleNumericHeight}></input>
                                <br></br>
                                <div className={'space20'}/>

                                <label>Номер аудитории</label>
                                <br></br>
                                <input maxLength="5" className={'formInput'} name='fnum' value={numericNum} onChange={handleNumericNum}></input>
                                <br></br>
                                <div className={'space20'}/>
                                <div className={'space20'}/>
                                <div style={{textAlign: 'center', display:'flex'}}>
                                    <BlueButton type="submit" style={{width: '60%', margin: 'auto'}}>Сохранить</BlueButton>
                                </div>
                            </form>
                            <div className={'space20'}/>
                        </div>
                    </div>
                }
                {drag === 'oops' &&
                    <div className="upload_parent">
                        <div className="upload_child" style={{textAlign: 'center'}}>
                            <div className={'oops'}>
                                Упс!
                            </div>
                            <div className={'space40'}/>
                            <div className={'error'}>
                                Похоже, что Вы загрузили недопустимый файл 😞
                            </div>
                            <div className={'space40'}/>
                            <div className={'error'}>
                                Повторите загрузку
                            </div>
                            <div className={'space40'}/>
                            <BlueButton style={{width: '30%'}} onClick={uploadAgain}>Загрузить снова</BlueButton>
                        </div>
                    </div>
                }
                {drag === 'success' &&
                    <div className="upload_parent">
                        <div className="upload_child" style={{textAlign: 'center'}}>
                            <div className={'oops'}>
                                Успех!
                            </div>
                            <div className={'space40'}/>
                            <div className={'error'}>
                                Объект был успешно добавлен ✅
                            </div>
                            <div className={'space40'}/>
                            <BlueButton style={{width: '50%'}} onClick={toMain}>На главную</BlueButton>
                        </div>
                    </div>
                }
                <div className="space20"/>
            </>
        );
}

export default UploadBlock;