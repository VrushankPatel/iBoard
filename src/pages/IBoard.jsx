import React, { Component } from 'react'
import { Button, Form, ProgressBar } from "react-bootstrap";
import Util from "../Util/Util";
import socketIOClient from "socket.io-client";
var axios = require('axios');

class IBoard extends Component {
    constructor(props) {
        super(props);
        this.state = { text: "", uniqueId: "", isLoadDisabled: false, isPublishDisabled: false, isInProgress: false, autoPublish: false, autoReload: false, name: '', typing: false, typingTimeout: 0, reloadTimeout: 0, isTextDisabled: false };
        this.changeUniqueId = this.changeUniqueId.bind(this);
        this.changeText = this.changeText.bind(this);
        this.escFunction = this.shortcutsTrigger.bind(this);
        this.identifier = Util.identifier;
        this.socketEndpoint = Util.socketEndpoint;
        this.socket = socketIOClient();        
    }
    shortcutsTrigger = (event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();        
        if((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            this.publishData();
        }
        if((event.ctrlKey || event.metaKey) && charCode === 'c') {
            Util.copyToClipBoard(this.state.text);
        }
        if(event.key === 'Escape'){
            this.clearFields();
        }
      }
    
    changeUniqueId(event) {
        this.setState({ uniqueId: event.target.value, autoPublish: false });
    }
    changeText(event) {
        this.setState({ text: event.target.value, isTextDisabled: false }, () => {
            if (this.state.autoPublish) {
                this.socket.on("respondData", data => {
                    this.setState({ text: data });
                });
                this.socket.emit("publishData", [this.state.uniqueId, this.state.text], /*dataFromServer => {}*/);
            }
        });
    }
    componentDidMount() {
        document.addEventListener("keydown", this.shortcutsTrigger, false);
        this.socket = socketIOClient(this.socketEndpoint);        
        Util.awakeEndpoint();
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.shortcutsTrigger, false);
      }
    getData = () => {
        if (!this.state.uniqueId) return;
        this.setState({ isLoadDisabled: true, isInProgress: this.state.autoReload ? false : true, isTextDisabled: true });
        const data = JSON.stringify({ "uniqueId": this.state.uniqueId })
        const config = {
            method: 'POST',
            url: this.identifier + "/iBoardGet",
            headers: { 'Content-Type': 'application/json' },
            data: data
        };

        axios(config)
            .then((response) => {
                if (response.status === 204) {
                    // alert("No Data Found for this Id");
                    this.setState({ isLoadDisabled: false, isTextDisabled: false });
                }
                this.setState({ text: response.data, isLoadDisabled: this.state.autoReload || this.state.autoPublish, isInProgress: false, isTextDisabled: false })
            })
            .catch((error) => {
                if (!navigator.onLine) alert("No Internet, Please check your Connection!");
                else alert("Error occured");
                this.setState({ isPublishDisabled: false, isLoadDisabled: false, isInProgress: false, autoReload: false, isTextDisabled: false })
            });
    }
    publishData = () => {
        if (!this.state.uniqueId) return;
        this.setState({ isPublishDisabled: true, isInProgress: this.state.autoPublish ? false : true });
        const data = JSON.stringify({ "uniqueId": this.state.uniqueId, "payLoad": this.state.text })
        const config = {
            method: 'POST',
            url: this.identifier + "/iBoardInsertPayLoad",
            headers: { 'Content-Type': 'application/json' },
            data: data
        };

        axios(config)
            .then((response) => {
                // if (response.status === 202) alert("Updated data");
                // if (response.status === 201) alert("Inserted data");
                this.setState({ isPublishDisabled: this.state.autoPublish, isInProgress: false })
            })
            .catch((error) => {
                if (!navigator.onLine) alert("No Internet, Please check your Connection!");
                else alert("Error occured");
                this.setState({ isPublishDisabled: false, isInProgress: false, autoPublish: false, isLoadDisabled: false })
            });
    }
    clearFields() {
        if (!this.state.autoPublish && !this.state.autoReload) {
            this.setState({ text: "", uniqueId: "" });
        }
    }
    reloader() {
        if (!this.state.autoReload) {
            return;
        }
        this.socket.on("respondData", data => {
            this.setState({ text: data });
        });
        setInterval(() => {
            if (this.state.autoReload) {
                this.socket.emit("getDataFromUniqueId", this.state.uniqueId, /*dataFromServer => {}*/);
                return;
            }
        }, 10);
    }
    enableAutoPublish = () => {
        this.getData();
        this.setState({
            autoPublish: this.state.uniqueId ? !this.state.autoPublish : false, autoReload: false,
            isPublishDisabled: this.state.uniqueId ? !this.state.autoPublish : false,
            isLoadDisabled: this.state.uniqueId ? !this.state.autoPublish : false
        })
    }
    enableLiveReload = () => {
        this.setState({
            autoReload: this.state.uniqueId ? !this.state.autoReload : false, autoPublish: false,
            isPublishDisabled: this.state.uniqueId ? !this.state.autoReload : false,
            isLoadDisabled: this.state.uniqueId ? !this.state.autoReload : false
        }, this.reloader);
    }
    render() {
        const textAreaStyle = { border: "1px solid black" }
        const progressBarStyle = { visibility: this.state.isInProgress ? "visible" : "hidden", display: this.state.isInProgress ? "block" : "none" };
        return (
            <div>
                <div className="row">
                    <div className="col-3 pb-1" >
                        <Form.Control type="text" value={this.state.uniqueId} onChange={this.changeUniqueId} placeholder="Enter Unique ID" disabled={this.state.autoPublish || this.state.autoReload} />
                    </div>

                    <div className="col-6 float-left">
                        <div className="float-left pt-1">
                            <Button variant="info" size="sm" onClick={this.getData} disabled={this.state.isLoadDisabled || this.state.autoReload}>Load</Button>{" "}
                            <Button variant="success" size="sm" onClick={this.publishData} disabled={this.state.isPublishDisabled}>Publish</Button>{" "}
                            <Button size="sm" variant="outline-dark font-weight-bold" onClick={this.enableAutoPublish} >
                                Auto Publish : {this.state.autoPublish ? "On" : "Off"}
                            </Button> {" "}
                            <Button size="sm" variant="outline-dark font-weight-bold" onClick={this.enableLiveReload}>
                                Live Reload : {this.state.autoReload ? "On" : "Off"}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row" style={progressBarStyle}>
                    <div className="col-12 pb-1" style={{ margin: "auto" }}>
                        <ProgressBar >
                            <ProgressBar animated striped variant="success" now={33} />
                            <ProgressBar animated striped variant="warning" now={34} />
                            <ProgressBar animated striped variant="info" now={33} />
                        </ProgressBar>
                    </div>
                </div>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" placeholder="Your text will appear here" style={textAreaStyle} value={this.state.text} onChange={this.changeText} rows={50} disabled={this.state.autoReload || this.state.isTextDisabled} />
                </Form.Group>
            </div >
        );
    }
}

export default IBoard;