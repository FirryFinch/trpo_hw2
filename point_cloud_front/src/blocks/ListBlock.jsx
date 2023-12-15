import React from 'react';
import './ListBlock.css';
import Highlighter from 'react-highlight-words';

class ListBlock extends React.Component {

    state = {
        objects: [],
    }

    componentDidMount() {
        fetch("/api/get-objects/", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({objects: res});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getUniqueSubclasses() {
        let subclasses = []
        let classes = []
        let sub = []

        for (let i in this.state.objects) {
            this.state.objects.map((output, i) => (
                subclasses[i] = output.subcl
            ))

            this.state.objects.map((output, i) => (
                classes[i] = output.cl
            ))
        }

        function eliminateDuplicates (arr) {

            let i,
                out = [],
                obj = {};

            for (i = 0; i < arr.length; i++) {
                obj[arr[i]] = 0;
            }

            for (i in obj) {
                out.push(i);
            }

            return out;
        }

        if (this.props.cl === 'Все')
        {
            return eliminateDuplicates(subclasses)
        }
        else
        {
            for (let i = 0; i < classes.length; i++)
            {
                if (classes[i] === this.props.cl)
                {
                    sub.push(subclasses[i])
                }
            }
            return eliminateDuplicates(sub)
        }
    }

    getFilteredSubclass(classItem){
        return this.filterBySearch(classItem);
    }

    getFilteredObject(renderedSubclass, objectName, objectSubclass){
        if (renderedSubclass === objectSubclass){
            return this.filterBySearch(objectName)
        }
    }

    filterBySearch(object){
        if (object.toLowerCase().includes(this.props.inp.toLowerCase())){
            return <Highlighter searchWords={[this.props.inp]} textToHighlight={object} highlightStyle={{backgroundColor: '#4DBDC2'}}/>
        }
    }

    handleObjectClick(event, object){
        this.props.obj(object);

        for (const li of document.querySelectorAll('li')) {
            li.classList.remove("activeObj");
            li.classList.remove("activeSub");
        }

        event.currentTarget.classList.add('activeObj');
        event.currentTarget.parentNode.parentNode.classList.add('activeSub')
    };

    render() {
        return (
            <nav className="list_position">
                <ul className="ul1">
                    {this.getUniqueSubclasses().map((subclassItem, subclassid) =>
                        <li key={subclassid} className="li1" >
                            {this.getFilteredSubclass(subclassItem)}
                            <ul className="ul1">
                                {this.state.objects.map((item, nameid) =>
                                    <li  key={nameid} className="li2" onClick={(e) => this.handleObjectClick(e, item)}>
                                        {this.getFilteredObject(subclassItem, item.name, item.subcl)}
                                    </li>
                                )}
                            </ul>
                        </li>
                        )}
                </ul>
            </nav>
        );
    }
}

export default ListBlock;

