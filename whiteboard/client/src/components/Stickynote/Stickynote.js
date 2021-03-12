import React, { Component } from 'react';
import Draggable from 'react-draggable';
import TextareaAutosize from 'react-textarea-autosize';
import { TiDeleteOutline } from 'react-icons/ti';

import './Stickynote.css';

class StickyNote extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            text: this.props.note.text,
            x: this.props.note.x,
            y: this.props.note.y,
            zindex: this.props.note.zindex,
            currIndex: this.props.note.zindex,
        };
    }

    onDrag = (e, ui) => {
        const note = {
            text: this.state.text,
            x: ui.x,
            y: ui.y,
            zindex: this.state.zindex,
        };
        this.setState({
            currIndex: 500,
        });
        this.props.setQuery(Math.random());
        this.props.onDrag(this.state.id, note);
    };

    onStopDrag = (e, ui) => {
        this.setState({
            x: ui.x,
            y: ui.y,
            currIndex: this.zindex,
        });
    }

    onContentChange = (event) => {
        this.setState({
            text: event.target.value,
        });
        this.updateStickyNote();
    };


    deleteStickyNote = () => {
        this.props.setQuery(Math.random);
        this.props.deleteStickyNote(this.state.id);
    };

    updateStickyNote = () => {
        const note = {
            text: this.state.text,
            x: this.state.x,
            y: this.state.y,
            zindex: this.state.zindex,
        };
        this.props.updateStickyNote(this.state.id, note);
    }

    renderNote = () => {
        return (
            <div key={this.state.id} className="note" style={{ zIndex: '100' }}>
                <div className="handle" style={{ justifyContent: 'flex-start' }}>
                    <TiDeleteOutline className="delete" onClick={this.deleteStickyNote}/>
                </div>
                <TextareaAutosize className="editing" onChange={this.onContentChange} value={this.state.text} />
            </div>

        );
    };


    render() {
        const { x, y } = this.props.note;
        const position = {
            x, y, width: 50, height: 50,
        };

        return (

            <Draggable
                handle=".handle"
                grid={[10, 10]}
                position={position}
                onStop={this.onStopDrag}
                onDrag={this.onDrag}
                bounds="body"
            >
                {this.renderNote()}
            </Draggable>


        );
    }
}

export default StickyNote;