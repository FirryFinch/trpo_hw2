import React from 'react';
import './MainBlock.css';
import SearchBlock from "./SearchBlock";
import NavigationBlock from "./NavigationBlock";
import ListBlock from "./ListBlock";
import ViewBlock from "./ViewBlock";

class MainBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            activeClass: 'Все',
            activeObject: '',
            infoState: false,
        };
    }

    handleSearchInput = (searchInputValue) => {
        this.setState({searchInput: searchInputValue})
    }

    handleClassClick = (classNameValue) => {
        this.setState({activeClass: classNameValue})
        this.setState({infoState: false})
    }

    handleObjectClick = (object) => {
        this.setState({activeObject: object})
        this.setState({infoState: false})
    }

    handleInfoChange = (state) => {
        this.setState({infoState: state})
    }

    render() {
        return (
            <div className="mainframe_position">
                <div className="left_position">
                    <SearchBlock
                        inp={this.handleSearchInput}
                    />
                    <div style={{height: '2vh'}}/>
                    <NavigationBlock
                        cl={this.handleClassClick}
                        obj={this.handleObjectClick}
                    />
                    <div style={{height: '2vh'}}/>
                    <ListBlock
                        inp={this.state.searchInput}
                        cl={this.state.activeClass}
                        obj={this.handleObjectClick}
                    />
                </div>
                <div className="right_position">
                    <ViewBlock
                        obj={this.state.activeObject}
                        group={this.props.group}
                        info={this.state.infoState}
                        infchange={this.handleInfoChange}
                        csrf={this.props.csrf}
                    />
                </div>
            </div>
        );
    }
}

export default MainBlock;