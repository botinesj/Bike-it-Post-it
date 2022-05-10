import React from "react";
import "../../components/Modal/Modal.css";
import { uid } from "react-uid";
import Box from "@material-ui/core/Box";
import { checkUserExists, loginUser, registerUser } from "../../actions/users.js";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const log = console.log;

const style = {
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};


class RegisterModal extends React.Component {

    state = {
        username: null,
        password: null,
        name: null,
        gender: 'Male',
        location: null,
        description: null,
        picture: null,
        role: 'regular',
        uploadAlert: false,
        registerAlert: false,
        isUserTaken: false,
        isRegistered: false
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    onFileChange = (event) => {
        // Update the state when picture is uploaded
        // Help from: https://stackoverflow.com/questions/43992427/how-to-display-a-image-selected-from-input-type-file-in-reactjs

        event.preventDefault();
        const reader = new FileReader();
        const file = event.target.files[0];

        if (event.target.files.length === 0) {
            return;
        }

        reader.onloadend = (event) => {
            this.setState({
                picture: reader.result,
                uploadAlert: true,
            });
            this.closeAlerts()
        };
        reader.readAsDataURL(file);
    };

    handleRegister() {
        registerUser(this)
    }

    onRegistered() {
        this.setState({
            registerAlert: true
        });
        this.closeAlerts()
    }

    closeAlerts() {
        setTimeout(() => {
            this.setState({
                registerAlert: false,
                uploadAlert: false,
            });
        }, 1000)
    }

    onUsernameUpdate = (event) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            username: value
        })
        if(value.length > 0 ) {
            checkUserExists(this, value)
        }
    }

    render() {
        const { app, modalOpen, closeModal } = this.props;
        return (
            <div>
                <Modal
                    open={modalOpen}>
                    <Box sx={style}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Register
                        </Typography>

                        <Grid className="post-form1" container spacing={4} columns={3}>
                            <Grid item xs={12} align="center">
                                <TextField
                                    id="filled-basic"
                                    label="Username"
                                    variant="outlined"
                                    value={this.state.username}
                                    name="username"
                                    onChange={this.onUsernameUpdate}
                                    inputProps={{ maxLength: 25 }}
                                    style={{ width: "60%" }}
                                />

                                {this.state.isUserTaken && this.state.username.length!==0 &&
                                <p id="usernameTaken">Username is taken</p>
                                }
                            </Grid>
                        </Grid>

                        <Grid className="post-form2" container spacing={4} columns={3}>
                            <Grid item xs={12} align="center">
                                <TextField
                                    id="filled-basic"
                                    label="Password"
                                    variant="outlined"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    type="password"
                                    name="password"
                                    inputProps={{ maxLength: 25 }}
                                    style={{ width: "60%" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid className="post-form3" container spacing={4} columns={3}>
                            <Grid item xs={12} align="center">
                                <TextField
                                    id="filled-basic"
                                    label="name"
                                    variant="outlined"
                                    value={this.state.name}
                                    onChange={this.handleInputChange}
                                    inputProps={{ maxLength: 25 }}
                                    name="name"
                                    style={{ width: "60%" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid className="post-form4" container spacing={4} columns={3}>
                            <Grid item xs={12} align="center">
                                <TextField
                                    id="filled-basic"
                                    label="location"
                                    variant="outlined"
                                    value={this.state.location}
                                    onChange={this.handleInputChange}
                                    name="location"
                                    inputProps={{ maxLength: 25 }}
                                    style={{ width: "60%" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            <Grid item xs={12} align="center">
                                <FormControl>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        value={this.state.gender}
                                        label="Gender"
                                        name="gender"
                                        onChange={this.handleInputChange}
                                        disableEnforceFocus
                                    >
                                        <MenuItem value={"Male"}>Male</MenuItem>
                                        <MenuItem value={"Female"}>Female</MenuItem>
                                        <MenuItem value={"Non-binary"}>Non-binary</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid className="post-form5" container spacing={4} columns={3}>
                            <Grid item xs={12} align="center">
                                <TextField
                                    id="filled-basic"
                                    label="Description"
                                    variant="outlined"
                                    defaultValue={this.state.description}
                                    onChange={this.handleInputChange}
                                    name="description"
                                    InputProps={{ inputProps: { maxLength: 125 } }}
                                    multiline
                                    rows={5}
                                    maxRows={5}
                                    style={{ width: "80%" }}
                                />
                            </Grid>
                        </Grid>



                        {!this.state.isRegistered && <Grid
                            className="post-form3"
                            container
                            spacing={2}
                            style={{ marginTop: "5%" }}
                        >
                            <Grid item xs={3} align="center">
                                <Button
                                    variant="contained"
                                    component="label"
                                    onChange={this.onFileChange}
                                    color="secondary"
                                >
                                    Upload Profile Picture
                                    <input type="file" hidden />
                                </Button>
                            </Grid>

                            <Grid item xs={3} align="center">
                                <Button
                                    variant="contained"
                                    component="label"
                                    onClick={() => { this.handleRegister(closeModal) }}
                                    color="primary"
                                >
                                    Register
                                </Button>
                            </Grid>

                            <Grid item xs={3} align="center">
                                <Button
                                    variant="contained"
                                    component="label"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>}

                        {this.state.isRegistered &&
                            <Grid
                                className="post-form3"
                                container
                                spacing={2}
                                style={{ marginTop: "5%" }}
                            >
                                <Grid item xs={3} align="center">
                                    <Button
                                        variant="contained"
                                        component="label"
                                        onClick={() => { loginUser(this, app) }}
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                </Grid>

                                <Grid item xs={3} align="center">
                                    <Button
                                        variant="contained"
                                        component="label"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>}
                    </Box>
                </Modal>

                <Dialog open={this.state.uploadAlert}>
                    <Alert severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        Photo has been uploaded.
                    </Alert>
                </Dialog>

                <Dialog open={this.state.registerAlert}>
                    <Alert severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        You've been registered!
                    </Alert>
                </Dialog>

            </div >

        );
    }
}

export default RegisterModal