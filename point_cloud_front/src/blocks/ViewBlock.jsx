import React from 'react';
import moment from "moment";

import './ViewBlock.css';
import '../General.css'

// Графопостроитель - Plotly JS с отображением типа scatter3d
import Plot from 'react-plotly.js'

// Графопостроитель ScatterGL, не используется
// import {ScatterGL} from "scatter-gl";

class ViewBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            info: false,
            edit: false,
            subclasses: [''],
            classes: [''],

            letterName: this.props.obj.name,
            firstSelectOption: this.props.obj.cl,
            secondSelectOption: this.props.obj.subcl,
            numericLength: this.props.obj.length,
            numericWidth: this.props.obj.width,
            numericHeight: this.props.obj.height,
            numericNum: this.props.obj.num,
        };
    }

    x_array = []
    y_array= []
    z_array= []

    traces = Array(1).fill(0).map((_) => {
        return {
            x: this.x_array,
            y: this.y_array,
            z: this.z_array,
            mode: 'markers',
            marker:
                {
                    size: 2,
                    color: '#EC6442',
                    opacity: 0.5,
                },
            type: 'scatter3d',
            hoverlabel:
                {
                    bgcolor: '#FFFFFF',
                    font:
                        {
                            family: 'Roboto, serif'
                        },
                },
        };
    });

    componentDidMount() {
        this.getClassesList()
        this.getSubclassesList()
    }

    handleInfo () {
        if (this.props.info === true)
        {
            this.props.infchange(false)
            this.setState({edit: false})
        }
        if (this.props.info === false)
        {
            this.props.infchange(true)
            this.setState({edit: false})
            this.defaultStates()

        }
    }

    handleEdit () {
        if (this.state.edit === true)
        {
            this.setState({edit: false})
            this.defaultStates()
        }
        if (this.state.edit === false)
        {
            this.setState({edit: true})
        }
    }

    getClassesList () {
        fetch("api/get-classes/", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({classes: data});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getSubclassesList () {
        fetch("api/get-subclasses/", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({subclasses: data});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    trashHandler(objid){
        fetch("api/objects/", {
            method: "DELETE",
            headers: {
                "X-CSRFToken": this.props.csrf
            },
            credentials: "include",
            body: JSON.stringify({id: objid}),
        })
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleLetterName = (event) => {
        const result = event.target.value;
        this.setState({letterName: result});
    };

    handleNumericLength = (event) => {
        const result = event.target.value.replace(/\D/g, "");
        this.setState({numericLength: result});
    };

    handleNumericWidth = (event) => {
        const result = event.target.value.replace(/\D/g, "");
        this.setState({numericWidth: result});
    };

    handleNumericHeight = (event) => {
        const result = event.target.value.replace(/\D/g, "");
        this.setState({numericHeight: result});
    };

    handleNumericNum = (event) => {
        const result = event.target.value.replace(/\D/g, "");
        this.setState({numericNum: result});
    };

    handleFirstSelectChange = (event) =>{
        this.setState({firstSelectOption: event.target.value})
    }

    handleSecondSelectChange = (event) =>{
        this.setState({secondSelectOption: event.target.value})
    }

    defaultStates (){
        this.setState({letterName: this.props.obj.name})
        this.setState({firstSelectOption: this.props.obj.cl})
        this.setState({secondSelectOption: this.props.obj.subcl})
        this.setState({numericLength: this.props.obj.length})
        this.setState({numericWidth: this.props.obj.width})
        this.setState({numericHeight: this.props.obj.height})
        this.setState({numericNum: this.props.obj.num})
    }

    handleSave = (event, objid) =>
    {
        window.location.reload();
        fetch("api/objects/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.props.csrf
            },
            credentials: "include",
            body: JSON.stringify({
                id: objid,
                name: event.target.ename.value,
                cl: event.target.ecl.value,
                subcl: event.target.esubcl.value,
                length: event.target.elength.value,
                width: event.target.ewidth.value,
                height: event.target.eheight.value,
                num: event.target.enum.value
            }),
        })
            .then((res) => {
                console.log(res)
                this.defaultStates()
            })
            .catch((err) => {
                console.log(err);
            });
    }

    cleanArrays(){
        this.x_array.splice(0, this.x_array.length)
        this.y_array.splice(0, this.y_array.length)
        this.z_array.splice(0, this.z_array.length)
    }

    fillArrays(){
        for (let i = 0; i < this.props.obj.file_data_x.length; i++) {
            this.x_array[i] = this.props.obj.file_data_x[i];
            this.y_array[i] = this.props.obj.file_data_y[i];
            this.z_array[i] = this.props.obj.file_data_z[i];
        }
    }

    // Проба для ScatterGL
    // использовать с file_data_xyz
    //
    // scat;
    // ds;
    //
    // renderContent(){
    // this.ds = new ScatterGL.Dataset(this.props.obj.file_data_xyz);
    // this.scat = new ScatterGL(document.getElementById('right'));
    //     this.scat.render(this.ds)
    // }

    render() {

        if ((this.props.obj) && (this.props.info === false))
        {
            this.cleanArrays();
            this.fillArrays();
        }

        return (
            <>
                {
                    this.props.obj &&
                    <>
                        <div className="spaceFont"/>
                        <div className="header">
                            <div className="name_text">{this.props.obj.name} ({this.x_array.length} точек)</div>
                            {
                                this.props.info === true &&
                                <>
                                    {
                                        this.state.edit === true &&
                                        <>
                                            <button className="save" form="changeform" type="submit" style={{marginLeft: "auto"}}/>
                                            <div className="delete" onClick={(e) => this.handleEdit(e)}/>
                                            <div className="activeInfo" onClick={(e) => this.handleInfo(e)}/>
                                        </>
                                    }

                                    {
                                        this.state.edit === false &&
                                        <>
                                            {
                                                this.props.group === "admin" &&
                                                <>
                                                    <div className="edit" style={{marginLeft: "auto"}} onClick={(e) => this.handleEdit(e)}/>
                                                    <div className="activeInfo" onClick={(e) => this.handleInfo(e)}/>
                                                </>
                                            }

                                            {
                                                this.props.group === "user" &&
                                                <>
                                                    <div className="activeInfo" style={{marginLeft: "auto"}} onClick={(e) => this.handleInfo(e)}/>
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }

                            {
                                this.props.info === false &&
                                <>
                                    <div className="info" style={{marginLeft: "auto"}} onClick={(e) => this.handleInfo(e)}/>
                                </>
                            }

                            <div className="download" onClick={() => {window.location = this.props.obj.file_url}}/>

                            {
                                this.props.group === "admin" &&
                                <div className="trash" onClick={() => {if(window.confirm('Вы действительно хотите удалить объект ' + this.props.obj.name + '?')){this.trashHandler(this.props.obj.id)}}}/>
                            }
                        </div>

                        {
                            this.props.info === true &&
                            <form id="changeform" onSubmit={(event) => {if(window.confirm('Сохранить свойства для объекта ' + this.props.obj.name + '?')){this.handleSave(event, this.props.obj.id)}}} className="infoForm">

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Название</label>
                                    <input
                                        maxLength="50"
                                        disabled={!this.state.edit}
                                        className="infoInput"
                                        value={this.state.letterName}
                                        name='ename'
                                        onChange={this.handleLetterName}/>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Класс</label>
                                    <select
                                        disabled={!this.state.edit}
                                        style={{height: '5vh'}}
                                        className="infoInput"
                                        name='ecl'
                                        value={this.state.firstSelectOption}
                                        onChange={this.handleFirstSelectChange}>
                                        {
                                            this.state.classes.map(({ id, title }) =>
                                            {
                                                if (this.props.obj.cl === title)
                                                {
                                                    return(<option selected key={id}>{title}</option>);
                                                }
                                                else
                                                {

                                                    return(<option key={id}>{title}</option>);
                                                }
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Подкласс</label>
                                    <select
                                        disabled={!this.state.edit}
                                        style={{height: '5vh'}}
                                        className="infoInput"
                                        name='esubcl'
                                        value={this.state.secondSelectOption}
                                        onChange={this.handleSecondSelectChange}>
                                        {
                                            this.state.subclasses.map(({ id, title, cl }) =>
                                            {
                                                if (cl === this.state.firstSelectOption)
                                                {
                                                    if (this.props.obj.subcl === title)
                                                    {
                                                        return(<option selected key={id}>{title}</option>);
                                                    }
                                                    else
                                                    {
                                                        return(<option key={id}>{title}</option>);
                                                    }
                                                }
                                                return null;
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Длина</label>
                                    <input
                                        maxLength="6"
                                        disabled={!this.state.edit}
                                        className="infoInput"
                                        name='elength'
                                        value={this.state.numericLength}
                                        onChange={this.handleNumericLength}/>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Ширина</label>
                                    <input
                                        maxLength="6"
                                        disabled={!this.state.edit}
                                        className="infoInput"
                                        value={this.state.numericWidth}
                                        name='ewidth'
                                        onChange={this.handleNumericWidth}
                                    />
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Высота</label>
                                    <input
                                        maxLength="6"
                                        disabled={!this.state.edit}
                                        className="infoInput"
                                        value={this.state.numericHeight}
                                        name='eheight'
                                        onChange={this.handleNumericHeight}/>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Номер аудитории</label>
                                    <input
                                        maxLength="5"
                                        disabled={!this.state.edit}
                                        className="infoInput"
                                        value={this.state.numericNum}
                                        name='enum'
                                        onChange={this.handleNumericNum}/>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Дата добавления</label>
                                    <input
                                        disabled className="infoInput"
                                        value={moment(this.props.obj.time_create).format('DD.MM.YYYY, HH:mm:ss')}/>
                                </div>

                                <div className="space20"/>

                                <div className="infoGroup">
                                    <label style={{color: 'black'}}>Добавил</label>
                                    <input
                                        disabled className="infoInput"
                                        value={(this.props.obj.created_by_last_name + ' ' + this.props.obj.created_by_first_name + ' (' + this.props.obj.created_by_username + ')')}/>
                                </div>
                            </form>
                        }
                        {
                            this.props.info === false && this.x_array.length < 16000 &&
                            <>
                                <Plot
                                    data={this.traces}
                                    layout=
                                        {{
                                            paper_bgcolor: '#F7F7F9',
                                            height: 455,
                                            width: 647,
                                            font:
                                                {
                                                    family: 'Roboto, serif',
                                                    size: 14
                                                },
                                            margin:
                                                {
                                                    b: 20,
                                                    l: 20,
                                                    r: 20,
                                                    t: 20,
                                                },
                                        }}
                                    config=
                                        {{
                                            displayModeBar: false
                                        }}
                                />
                            </>
                        }
                    </>
                }
                {
                    !this.props.obj &&
                    <div className="choose_parent">
                        <div className="choose_child">
                            <div className="object_image"/>
                            <div className="space20"/>
                            Выберите объект для отображения...
                        </div>
                    </div>
                }


                {this.props.info === false && this.x_array.length > 16000 &&
                    <>
                        <div className="choose_parent" style={{height: '71vh'}}>
                            <div className="choose_child">
                                <div className="noviewimage"/>
                                <div className="space20"/>
                                Предпросмотр недоступен, слишком большое количество точек
                            </div>
                        </div>
                    </>
                }
            </>
        );
        }
}
export default ViewBlock;