import React from 'react';

import './App.css';
import '../components/inputs/Inputs.css'

import BlueButton from "../components/buttons/BlueButton";
import GlobalHeader from "../components/headers/GlobalHeader";
import MainBlock from "../blocks/MainBlock";
import UploadBlock from "../blocks/UploadBlock";
import Error from "./Error";

class App extends React.Component  {

    constructor(props) {
        super(props);

        this.state = {
            csrf: "",
            username: "",
            password: "",
            error: "",
            isAuthenticated: false,
            display: "main",
        };
    }

    componentDidMount = () => {
        this.getSession();
    }

    getCSRF = () => {
        fetch("api/csrf/", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                this.setState({csrf: csrfToken})
                localStorage.setItem("csrf_key", csrfToken);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getSession = () => {
        fetch("api/session/", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.isAuthenticated) {
                    this.setState({isAuthenticated: true});
                    localStorage.setItem("auth_key", 'true');
                } else {
                    this.setState({isAuthenticated: false});
                    localStorage.setItem("auth_key", 'false');
                    this.getCSRF();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleUserNameChange = (event) => {
        this.setState({username: event.target.value});
    }

    isResponseOk(response) {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    }

    login = (event) => {
        event.preventDefault();
        fetch("api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.state.csrf,
            },
            credentials: "include",
            body: JSON.stringify({username: this.state.username, password: this.state.password}),
        })
            .then(this.isResponseOk)
            .then((data) => {
                console.log(data);
                this.setState({isAuthenticated: true, username: "", password: "", error: ""});
                localStorage.setItem("user_id_key", data.user_id);
                localStorage.setItem("username_key", data.username);
                localStorage.setItem("firstname_key", data.first_name);
                localStorage.setItem("lastname_key", data.last_name);
                localStorage.setItem("group_key", data.group);
                localStorage.setItem("auth_key", 'true');
                this.getCSRF()
            })
            .catch((err) => {
                console.log(err);
                this.setState({error: "Wrong username or password"});
            });
    }

    logout = () => {
        fetch("api/logout", {
            credentials: "include",
        })
            .then(this.isResponseOk)
            .then((data) => {
                console.log(data);
                this.setState({isAuthenticated: false});
                localStorage.clear();
                this.getCSRF();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    who = () => {
        fetch("api/whoami/", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                localStorage.setItem("username_key", data.username);
                localStorage.setItem("firstname_key", data.first_name);
                localStorage.setItem("lastname_key", data.last_name);
                localStorage.setItem("group_key", data.group);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onUploadItemClicked = () => {
        this.setState({display: "upload"})
    }


    onHomeItemClicked = () => {
        this.setState({display: "main"})
    }

    render() {
        let error_text;

        if (!this.state.error)
        {
            error_text = <div style={{ height: "7vh" }}/>
        }
        else
        {
            error_text =
                <div style={{height: "7vh", fontSize: "2.6vh /*18 px*/", fontFamily: "Roboto, serif", color: "#9F9F9F"}}>
                    Что-то введено неверно. Попробуйте ещё раз.
                </div>
        }

        if (!this.state.isAuthenticated) {
            return (
                <div className="login_background">
                    <div className="login_white_frame">
                        <h2 style={{ textAlign: "center"}}>
                            Необходимо войти <br/> в систему
                        </h2>
                        <div className={'space'}/>
                        <form onSubmit={this.login}>
                            <label>Логин</label>
                            <input type="text" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange}/>
                            <div className={'space20'}/>
                            <label>Пароль</label>
                            <input type="password" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                            <div className={'space40'}/>
                            {error_text}
                            <div className={'space40'}/>
                            <BlueButton type="submit" style={{ width: "100%" }}> Войти </BlueButton>
                        </form>
                    </div>
                </div>
            );
        }
        else {
            if (this.state.display === "main"){
                return (
                    <>
                        <GlobalHeader username={localStorage.getItem("username_key")}
                                      lastname={localStorage.getItem("lastname_key")}
                                      firstname={localStorage.getItem("firstname_key")}
                                      group={localStorage.getItem("group_key")}
                                      logout={this.logout}
                                      onUploadClicked={this.onUploadItemClicked}
                                      onHomeClicked={this.onHomeItemClicked}/>
                        <MainBlock
                            group={localStorage.getItem("group_key")}
                            csrf={localStorage.getItem("csrf_key")}
                        />
                    </>
                );
            }
            if (this.state.display === "upload"){
                return (
                    <>
                        <GlobalHeader username={localStorage.getItem("username_key")}
                                      lastname={localStorage.getItem("lastname_key")}
                                      firstname={localStorage.getItem("firstname_key")}
                                      group={localStorage.getItem("group_key")}
                                      logout={this.logout}
                                      onUploadClicked={this.onUploadItemClicked}
                                      onHomeClicked={this.onHomeItemClicked}/>
                        <UploadBlock
                            user_id={localStorage.getItem("user_id_key")}
                            csrf={localStorage.getItem("csrf_key")}
                            toMain={this.onHomeItemClicked}
                        />
                    </>
                );
            }
        }
    }
}

export default App;
