import React from 'react';
import './NavigationBlock.css';

class NavigationBlock extends React.Component  {
    state = {
        classes: [],
    }

    componentDidMount() {
        fetch("/api/classes", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({ classes: res });
            })
            .catch((err) => {
                console.log(err);
            });

    }


    handleClassClick(event, className){
        this.props.cl(className);

        for (const li of document.querySelectorAll('li')) {
            li.classList.remove("activeCl");
            li.classList.remove("activeObj");
            li.classList.remove("activeSub");
            this.props.obj('');
        }

        event.currentTarget.classList.add('activeCl');
    };

    render() {
        return(
            <nav className="navframe_position">
                <ul>
                    <li className={"activeCl"} onClick={(e) => this.handleClassClick(e, 'Все')}>Все</li>
                    {this.state.classes.map((output, id) => (
                        <li key={id} onClick={(e) => this.handleClassClick(e, output.title)}>{output.title}</li>
                    ))}
                </ul>
            </nav>
            )
    }
}
export default NavigationBlock;