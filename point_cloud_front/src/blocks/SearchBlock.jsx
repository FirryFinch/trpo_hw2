import React from 'react';
import './SearchBlock.css';
import '../components/inputs/Inputs.css'

class SearchBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleSearchInputChange = (event) => {
         this.props.inp(event.target.value);
    };

    render(){
        return(
            <div className="searchframe_position">
                <label>Поиск</label>
                <input type="text" name='search-input' onChange={this.handleSearchInputChange}/>
            </div>
        );
    }
}

export default SearchBlock;