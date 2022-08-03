import React, { Component } from 'react'
import { Button, Form, ProgressBar, Navbar, Nav } from "react-bootstrap";
import Util from "../Util/Util";
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faArrowDown, faArrowUp, faBroom, faCopy, faLink } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';

var axios = require('axios');


class IBoard extends Component {
    constructor(props) {
        super(props);
        if(localStorage.darkMode == null){
            localStorage.darkMode = false;
        }
        this.state = {
            text: "",
            uniqueId: "",
            isLoadDisabled: false,
            isPublishDisabled: false,
            isInProgress: false,
            autoPublish: false,
            autoReload: false,
            name: '',
            typing: false,
            typingTimeout: 0,
            reloadTimeout: 0,
            isTextDisabled: false,
            terminal: ">",
            background: localStorage.darkMode === "true" ? "#343a40" : "white",
            foreground: localStorage.darkMode === "true" ? "lightgrey" : "black",
            themeButtonText: localStorage.darkMode === "true" ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />,
            navbarTheme: localStorage.darkMode === "true" ? "dark" : "light",
            statusColor: "white",
        };
        this.uniqueIdInput = React.createRef();
        this.changeUniqueId = this.changeUniqueId.bind(this);
        this.changeText = this.changeText.bind(this);
        this.identifier = Util.identifier;
        this.socketEndpoint = Util.socketEndpoint;
        this.socket = socketIOClient();
    }

    shortcutsTrigger = (event) => {
        if(event.key === 'Escape') this.clearFields();
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            this.publishData();
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
        this.uniqueIdInput.current.focus();
        document.addEventListener("keydown", this.shortcutsTrigger, false);
        this.socket = socketIOClient(this.socketEndpoint);
        Util.awakeEndpoint();
        let uId = localStorage.uid;
        if(uId !== undefined){
            this.setState({uniqueId: uId}, () => {
                this.getData();
            });
            delete localStorage.uid;
        }
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.shortcutsTrigger, false);
    }
    getData = (isAutoPublishing) => {
        if (!this.state.uniqueId) {
            if (isAutoPublishing){
                this.setState({terminal: "> no unique Id, please enter one", statusColor: "red"});
            }
            return;
        }

        const isInProgress = !this.state.autoReload;

        this.setState({
            isLoadDisabled: true,
            isInProgress: isInProgress,
            isTextDisabled: true,
            terminal: "> loading data..."
        });

        const data = JSON.stringify({ "uniqueId": this.state.uniqueId })
        const config = {
            method: 'POST',
            url: this.identifier + "/iBoardGet",
            headers: { 'Content-Type': 'application/json' },
            data: data
        };

        axios(config)
            .then((response) => {
                const resultBool = response.status === 204;
                this.setState({
                    isLoadDisabled: !resultBool,
                    isTextDisabled: !resultBool
                });

                const isDataInserted = response.data.trim().length === 0;

                const statusTerminalMsg = isDataInserted ? "> no data inserted" : "> loaded successfully";
                const statusTerminalColor = isDataInserted ? "yellow" : "lightgreen";

                const isLoadDisabled = this.state.autoReload || this.state.autoPublish;
                const terminalMsg = isAutoPublishing ? "> auto publishing..." : statusTerminalMsg;
                const statusColor = isAutoPublishing ? "lightgreen" : statusTerminalColor;

                this.setState({
                    text: response.data,
                    isLoadDisabled: isLoadDisabled,
                    isInProgress: false,
                    isTextDisabled: false,
                    terminal: terminalMsg,
                    statusColor : statusColor
                });
            })
            .catch((error) => {
                if (!navigator.onLine) alert("No Internet, Please check your Connection!");
                else alert("Error occured");

                this.setState({
                    isPublishDisabled: false,
                    isLoadDisabled: false,
                    isInProgress: false,
                    autoReload: false,
                    isTextDisabled: false,
                    terminal: "> error loading data",
                    statusColor: "red",
                    autoPublish: false
                })
            });
    }
    publishData = () => {
        if (!this.state.uniqueId) {
            this.setState({
                terminal: "> no Unique Id, please enter one..",
                statusColor: "red"
            });
            return;
        }

        const isInProgress = this.state.autoPublish ? false : true;
        this.setState({
            terminal: "> publishing..",
            statusColor: "lightgreen",
            isPublishDisabled: true,
            isInProgress: isInProgress
        });

        const data = JSON.stringify({ "uniqueId": this.state.uniqueId, "payLoad": this.state.text })
        const config = {
            method: 'POST',
            url: this.identifier + "/iBoardInsertPayLoad",
            headers: { 'Content-Type': 'application/json' },
            data: data
        };

        axios(config)
            .then((response) => {
                this.setState({
                    isPublishDisabled: this.state.autoPublish,
                    isInProgress: false,
                    terminal: "> published, and copied link to Clipboard",
                    statusColor: "lightgreen"
                });
                this.copyTextToClipBoard(window.location.href + "byId/" + this.state.uniqueId);
            })
            .catch((error) => {
                if (!navigator.onLine) alert("No Internet, Please check your Connection!");
                else alert("Error occured");
                this.setState({
                    isPublishDisabled: false,
                    isInProgress: false,
                    autoPublish: false,
                    isLoadDisabled: false,
                    terminal: "> failed to publish",
                    statusColor: "red"
                });
            });
    }
    clearFields() {
        if (!this.state.autoPublish && !this.state.autoReload) {
            this.setState({ text: "", uniqueId: "", terminal: "> cleared all fields...", statusColor: "lightgreen" });
        }
    }
    reloader() {
        if (!this.state.autoReload) {
            this.setState({terminal: this.state.uniqueId ? "> stopped auto reload" : "> no unique id, please enter one", statusColor: this.state.uniqueId ? "lightgreen" : "red"})
            return;
        }
        this.socket.on("respondData", data => {
            this.setState({ text: data });
        });
        setInterval(() => {
            if (this.state.autoReload) {
                this.socket.emit("getDataFromUniqueId", this.state.uniqueId, /*dataFromServer => {}*/);
            }
        }, 10);
    }
    enableAutoPublish = () => {
        this.getData(!this.state.autoPublish);
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
            isLoadDisabled: this.state.uniqueId ? !this.state.autoReload : false,
            terminal: this.state.uniqueId ? "> auto reloading..." : "> can't auto reload without unique id",
            statusColor : this.state.uniqueId ? "lightgreen" : "red"
        }, this.reloader);
    }

    getDataIfEnterKeyPressed = (event) => {
        if (event.key === "Enter") this.getData();
    }

    copyDataToClipBoard = () => {
        Util.copyToClipBoard(this.state.text);
        this.setState({terminal: this.state.text ? "> text copied to clipboard.." : "> nothing to copy.."});
        this.setState({statusColor: this.state.text ? "lightgreen" : "yellow"});
    }

    copyTextToClipBoard = (text) => {
        Util.copyToClipBoard(text);
    }

    copyTextToClipBoard2 = (text) => {
        Util.copyToClipBoard(text);
        this.setState({terminal: "> Link to this iBoard copied to clipboard"});
    }

    toggleTheme = () => {
        if (localStorage.darkMode === "false"){
            localStorage.darkMode = "true";
            this.setState({
                background: "#343a40",
                foreground: "lightgrey",
                themeButtonText: <FontAwesomeIcon icon={faSun} />,
                navbarTheme: "dark"
            })
        }else {
            localStorage.darkMode = "false";
            this.setState({
                background: "white",
                foreground: "black",
                themeButtonText: <FontAwesomeIcon icon={faMoon} />,
                navbarTheme: "light"
            })
        }
    }

    render() {
        const textAreaStyle = {
            border: "1px solid " + this.state.foreground,
            backgroundColor: this.state.background,
            color: this.state.foreground
        }

        const visibility = this.state.isInProgress ? "visible" : "hidden";
        const display = this.state.isInProgress ? "block" : "none";

        const progressBarStyle = {
            visibility: visibility,
            display: display
        };

        return (
            <div>
                <Navbar bg={this.state.navbarTheme} expand="md">
                <Navbar.Brand
                    href="/"
                    style={{
                        fontFamily: "Exo",
                        fontSize: "XX-Large",
                        color: this.state.foreground,
                    }}
                >
                    iBoard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link style={{color: this.state.foreground}}>
                            Home
                        </Nav.Link>
                        <Nav.Link style={{color: this.state.foreground}} href="/About" >
                            About
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
                <div className="row" style={{backgroundColor: this.state.background}}>
                    <div className="col-3 pb-1" >
                        <Form.Control
                            ref={this.uniqueIdInput}
                            type="text"
                            value={this.state.uniqueId}
                            onChange={this.changeUniqueId}
                            placeholder="Enter Unique ID"
                            onKeyPress={this.getDataIfEnterKeyPressed}
                            style={{
                                backgroundColor: this.state.background,
                                color: this.state.foreground
                            }}
                            disabled={this.state.autoPublish || this.state.autoReload}
                        />
                    </div>

                    <div className="col-6 float-left">
                        <div className="float-left pt-1">
                            <Button
                                variant="info"
                                size="sm"
                                // title="Load (Reteieve content)"
                                data-tip
                                data-for='load-btn'
                                onClick={() => {
                                    this.getData();
                                }}
                                disabled={this.state.isLoadDisabled || this.state.autoReload}>
                                    {" "}<FontAwesomeIcon icon={faArrowDown} />{" "}
                            </Button>
                            <ReactTooltip id='load-btn' type='info'>
                                <span>Load (Reteieve content)</span>
                            </ReactTooltip>
                            {" "}
                            <Button
                                variant="success"
                                size="sm"
                                data-tip
                                data-for='publish-btn'
                                onClick={() => {
                                    this.publishData();
                                }}
                                disabled={this.state.isPublishDisabled}>
                                    <FontAwesomeIcon icon={faArrowUp} />
                            </Button>
                            <ReactTooltip id='publish-btn' type='success'>
                                <span>Publish [Ctrl+S]</span>
                            </ReactTooltip>
                            {" "}
                            <Button
                                size="sm"
                                title="Clear [Esc]"
                                data-tip
                                data-for='clear-btn'
                                variant="warning font-weight-bold"
                                onClick={() => this.clearFields()} >
                                <FontAwesomeIcon icon={faBroom} />
                            </Button>
                            <ReactTooltip id='clear-btn' type='warning'>
                                <span>Clear All</span>
                            </ReactTooltip>
                            {" "}
                            <Button
                                size="sm"
                                variant="outline-info font-weight-bold"
                                data-tip
                                data-for='copy-data-btn'
                                onClick={this.copyDataToClipBoard} >
                                <FontAwesomeIcon icon={faCopy} />
                            </Button>
                            <ReactTooltip id='copy-data-btn'>
                                <span>Copy data to clipboard</span>
                            </ReactTooltip>
                            {" "}
                            <Button
                                size="sm"
                                variant="outline-info font-weight-bold"
                                data-tip
                                data-for='copy-link-btn'
                                onClick={() => {
                                    this.copyTextToClipBoard2(window.location.href + "byId/" + this.state.uniqueId);
                                }} >
                                <FontAwesomeIcon icon={faLink} />
                            </Button>
                            <ReactTooltip id='copy-link-btn'>
                                <span>Copy link to clipboard</span>
                            </ReactTooltip>
                            {" "}
                            <Button
                                size="sm"
                                variant="outline-info font-weight-bold"
                                onClick={this.enableAutoPublish}>
                                Auto Publish : {this.state.autoPublish ? "On" : "Off"}
                            </Button>
                            {" "}
                            <Button
                                size="sm"
                                variant="outline-info font-weight-bold"
                                onClick={this.enableLiveReload}>
                                Live Reload : {this.state.autoReload ? "On" : "Off"}
                            </Button>
                            {" "}
                            <Button
                                size="sm"
                                variant="outline-info font-weight-bold"
                                data-tip
                                data-for='darklight'
                                onClick={this.toggleTheme}>
                                {this.state.themeButtonText}
                            </Button>
                            <ReactTooltip id='darklight' type='info'>
                                <span>Toggle mode</span>
                            </ReactTooltip>
                        </div>
                    </div>
                    <div className="col-3 float-left">
                    <Form.Control
                            type="text"
                            value={this.state.terminal}
                            onChange={this.changeUniqueId}
                            placeholder=">"
                            disabled={true}
                            style={{
                                backgroundColor: "black",
                                color : this.state.statusColor,
                                fontWeight: "Bold",

                            }}
                            title="Status Terminal"
                        />
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
                    <Form.Control
                        as="textarea"
                        placeholder="Your text will appear here"
                        style={textAreaStyle}
                        value={this.state.text}
                        onChange={this.changeText}
                        rows={50}
                        disabled={this.state.autoReload || this.state.isTextDisabled}
                         />
                </Form.Group>
            </div >
        );
    }
}

export default IBoard;