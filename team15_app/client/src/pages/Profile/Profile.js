import React from "react";
import "./Profile.css";
import TrailCard from "../Trail/TrailCard.js";
import PostCard from "../../components/Post/PostCard.js";
import BikeCard from "../Bike/BikeCard.js";

import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@mui/icons-material/Search";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputMask from "react-input-mask";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import BikeModal from "../Bike/BikeModal";
import TrailModal from "../Trail/TrailModal";
import PostModal from "../../components/Post/PostModal";
import { uid } from "react-uid";
import wheel from "../../assets/images/wheel.gif";
import Tooltip from "@mui/material/Tooltip";

import { addBike, editBikeSubmission, getBikes } from "../../actions/bike.js";
import {
  editPostSubmission,
  getPosts,
  profileSortFilter,
} from "../../actions/home.js";
import { addTrail, editTrailSubmission, getTrails } from "../../actions/trail.js";
import { getUser, editUserSubmission, editProfilePicSubmission } from "../../actions/users.js";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { withRouter } from "react-router"

const editStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const profilePicEditStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "25%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const bikeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const editBikeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const trailStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

/* Component for the Profile page */
class Profile extends React.Component {
  state = {
    profileUser: this.props.appState.user,
    searchInput: "",
    sortFilter: "new",
    currentUser: this.props.appState.user,
    users: [],
    posts: [],
    num_posts: 0,
    trails: [],
    num_trails: 0,
    bikes: [],
    num_bikes: 0,
    postsCheckbox: true,
    trailsCheckbox: true,
    createdTrailsCheckbox: true,
    ownedBikesCheckbox: true,

    editModalOpen: false,
    trailModalOpen: false,
    bikeModalOpen: false,

    userUserName: this.props.appState.user.username,

    userName: "",
    userGender: "",
    userLocation: "",
    userDescription: "",

    bikeModel: "",
    bikeDescription: "",
    bikeContactNumber: "",
    bikePrice: "",
    bikeSale: true,
    bikePicture: null,
    bikePurchased: "",
    stravaLink: "",

    trailTitle: "",
    trailTime: "",
    trailRating: "",
    trailPicture: null,

    editAlert: false,
    addBikeAlert: false,
    addTrailAlert: false,
    uploadAlert: false,

    editBikeModalOpen: false,
    bikeToEdit: "",
    editPostModalOpen: false,
    postToEdit: "",
    editTrailModalOpen: false,
    trailToEdit: "",

    editProfilePicModalOpen: false,
    profilePicture: null,

    trailPostSuccess: false,
    bikePostSuccess: false,
    postFail: false,
    editSuccess: false,
    editFail: false,

    followingTrails: [],

  };

  handleInputChange = (event) => {
    const target = event.target;
    if (target.type === "checkbox") {
      if (target.name === "postsCheckbox") {
        this.setState({
          postsCheckbox: !this.state.postsCheckbox,
        });
      } else if (target.name === "trailsCheckbox") {
        this.setState({
          trailsCheckbox: !this.state.trailsCheckbox,
        });
      } else if (target.name === "createdTrailsCheckbox") {
        this.setState({
          createdTrailsCheckbox: !this.state.createdTrailsCheckbox,
        });
      } else if (target.name === "ownedBikesCheckbox") {
        this.setState({
          ownedBikesCheckbox: !this.state.ownedBikesCheckbox,
        });
      } else if (target.name === "bikeSale") {
        this.setState({
          bikeSale: !this.state.bikeSale,
        });
      }
    } else {
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value,
      });
    }
  };

  toggleModalPost = (post) => {
    this.setState({
      selectedPost: post,
    });
  };

  toggleModalTrail = (trail) => {
    this.setState({
      selectedTrail: trail,
    });
  };

  toggleModalBike = (bike) => {
    this.setState({
      selectedBike: bike,
    });
  };

  editSuccessClose = () => this.setState({ editSuccess: false });
  editFailClose = () => this.setState({ editFail: false });

  editAlertClose = () => {
    this.setState({
      editAlert: false,
    });
  };

  addTrailAlertClose = () => {
    this.setState({
      addTrailAlert: false,
    });
  };

  uploadAlertClose = () => {
    this.setState({
      uploadAlert: false,
    });
  };

  trailPostSuccessClose = () => this.setState({ trailPostSuccess: false });
  bikePostSuccessClose = () => this.setState({ bikePostSuccess: false });

  postFailClose = () => {
    this.setState({
      postFail: false,
    });
  };

  editBikeModalClose = () => {
    this.setState({
      editBikeModalOpen: false,
    });
  };

  editTrailModalClose = () => {
    this.setState({
      editTrailModalOpen: false,
    });
  };

  editPostModalClose = () => {
    this.setState({
      editPostModalOpen: false,
    });
  };

  onFileChangeProfilePic = (event) => {
    // Update the state when picture is uploaded

    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];

    if (event.target.files.length === 0) {
      return;
    }

    reader.onloadend = (event) => {
      this.setState({
        profilePicture: reader.result,
        uploadAlert: true,
      });
    };
    reader.readAsDataURL(file);
  };

  onFileChangeTrail = (event) => {
    // Update the state when picture is uploaded

    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];

    if (event.target.files.length === 0) {
      return;
    }

    reader.onloadend = (event) => {
      this.setState({
        trailPicture: reader.result,
        uploadAlert: true,
      });
    };
    reader.readAsDataURL(file);
  };

  onFileChangeBike = (event) => {
    // Update the state when picture is uploaded

    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];

    if (event.target.files.length === 0) {
      return;
    }

    reader.onloadend = (event) => {
      this.setState({
        bikePicture: reader.result,
        uploadAlert: true,
      });
    };
    reader.readAsDataURL(file);
  };

  componentDidMount() {
    if (this.props.match.params.username !== undefined) {
      this.setState({
        userUserName: this.props.match.params.username
      })
    }

    getPosts(this)

    getTrails(this)

    getBikes(this)

    getUser(this, this.state.userUserName)

  }

  componentDidUpdate(prevProps, prevState) {
    console.log("running componentDidUpdate");
    console.log(prevProps.match.params.username)
    console.log(this.props.match.params.username)
    if (prevState.num_posts !== this.state.num_posts || prevState.num_trails !== this.state.num_trails || prevState.num_bikes !== this.state.num_bikes || prevState.editSuccess !== this.state.editSuccess || prevState.editAlert !== this.state.editAlert) {
      getPosts(this)
      getTrails(this)
      getBikes(this)
      getUser(this, this.state.userUserName)
    }

  }

  render() {
    const { appState } = this.props;

    var editInfoButton = 0;
    if (this.props.match.params.username === this.props.appState.user.username || this.props.match.params.username === undefined) {
      editInfoButton = (
        <Button
                  variant="contained"
                  component="label"
                  id="editProfile"
                  color="primary"
                  name="editModalOpen"
                  onClick={() => this.setState({ editModalOpen: true })}
                  className="profileButton"
                >
                  Edit Info
                </Button>
      );
    } else {
      editInfoButton = null;
    }

    var addTrailButton = 0;
    if (this.props.match.params.username === this.props.appState.user.username || this.props.match.params.username === undefined) {
      addTrailButton = (
        <Button
                  variant="contained"
                  component="label"
                  id="addRide"
                  color="primary"
                  name="editModalOpen"
                  onClick={() => this.setState({ trailModalOpen: true })}
                  className="profileButton"
                >
                  Add Trail
                </Button>
      );
    } else {
      addTrailButton = null;
    }

    var addBikeButton = 0;
    if (this.props.match.params.username === this.props.appState.user.username || this.props.match.params.username === undefined) {
      addBikeButton = (
        <Button
                  variant="contained"
                  component="label"
                  id="addBike"
                  color="primary"
                  name="bikeModalOpen"
                  onClick={() => this.setState({ bikeModalOpen: true })}
                  className="profileButton"
                >
                  Add Bike
                </Button>
      );
    } else {
      addBikeButton = null;
    }

    return (
      <div id="body">
        <div id="viewContainer">
          <div id="profile">
            <div id="profilePicContainer">
              <div>
                <img id="profilePicBackground" src={wheel} />

                <img
                  id="profilePic"
                  src={this.state.profileUser.picture}
                  onClick={() => {if (this.props.match.params.username === this.props.appState.user.username || this.props.match.params.username === undefined) {
                    this.setState({ editProfilePicModalOpen: true })
                  }
                }}
                />
              </div>
            </div>

            <div id="profileInfo">
              <p className="info">
                Username: <span>{this.state.profileUser.username}</span>
              </p>
              <p className="info">
                Name: <span>{this.state.profileUser.name}</span>
              </p>
              <p className="info">
                Gender: <span>{this.state.profileUser.gender}</span>
              </p>
              <p className="info">
                Location: <span>{this.state.profileUser.location}</span>
              </p>
              <p className="info">
                <span>{this.state.profileUser.description}</span>
              </p>
              <div id="profileButtons">
                {editInfoButton}
                {addTrailButton}
                {addBikeButton}
              </div>
            </div>
          </div>

          <div id="search">
            <div id="searchInnerBox">
              <div id="searchFilters">
                <h2><span>{this.state.profileUser.username}</span>'s History</h2> 
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 2 }}
                >
                  <FormGroup row>
                  <Tooltip title={this.state.profileUser.username + "'s Posts"}>
                    <FormControlLabel
                      control={<Checkbox />}
                      item
                      m={2}
                      label="Posts"
                      checked={this.state.postsCheckbox}
                      value="Posts"
                      name="postsCheckbox"
                      onChange={this.handleInputChange}
                    />
                  </Tooltip>

                  <Tooltip title={this.state.profileUser.username + "'s Created Trails"}>
                    <FormControlLabel
                      control={<Checkbox />}
                      item
                      m={2}
                      label="Created Trails"
                      checked={this.state.trailsCheckbox}
                      name="trailsCheckbox"
                      onChange={this.handleInputChange}
                    />
                  </Tooltip>

                  <Tooltip title={this.state.profileUser.username + "'s Followed Trails"}>
                    <FormControlLabel
                      control={<Checkbox />}
                      item
                      m={2}
                      label="Followed Trails"
                      checked={this.state.createdTrailsCheckbox}
                      name="createdTrailsCheckbox"
                      onChange={this.handleInputChange}
                    />
                  </Tooltip>

                  <Tooltip title={this.state.profileUser.username + "'s Bikes"}>
                    <FormControlLabel
                      control={<Checkbox />}
                      item
                      m={2}
                      label="Owned Bikes"
                      checked={this.state.ownedBikesCheckbox}
                      value="Owned Bikes"
                      name="ownedBikesCheckbox"
                      onChange={this.handleInputChange}
                    />
                  </Tooltip>

                  </FormGroup>
                  <SearchIcon sx={{ color: "action.active", mr: 1, my: 2.5 }} />

                  <TextField
                    label="Search"
                    variant="standard"
                    value={this.state.searchInput}
                    onChange={this.handleInputChange}
                    name="searchInput"
                    className="searchQueryBar"
                    style={{ width: "23%" }}
                  />
                  <Grid
                    item
                    xs={1}
                    sm={1}
                    md={1}
                    lg={1}
                    xl={1}
                    className="sortFilter"
                  >
                    
                    <FormControl style={{ width: 200, marginLeft: "50px" }}>
                      <InputLabel id="demo-simple-select-label">
                        Sort
                      </InputLabel>
                      <Select
                        value={this.state.sortFilter}
                        label="Sort"
                        name="sortFilter"
                        onChange={this.handleInputChange}
                      >
                        <MenuItem value={"new"}>
                          Date [Latest]
                        </MenuItem>
                        <MenuItem value={"old"}>
                          Date [Oldest]
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>

              <div id="searchResult">
                <div id="searchHeader">
                  <h2 id="searchHeaderText">Results</h2>
                </div>
                <div id="results">
                  {profileSortFilter(
                    this.state.posts.concat(
                      this.state.trails,
                      this.state.bikes 
                    ),
                    this.state
                  ).map((element) => {
                    if (
                      typeof element.likes !== "undefined" &&
                      this.state.postsCheckbox &&
                      element.author === this.state.profileUser.username &&
                      this.state.searchInput === ""
                    ) {
                      return (
                        <div className="card" key={uid(element)}>
                          <PostCard
                            post={element}
                            homeComponent={this}
                            appState={appState}
                            selectPost={this.toggleModalPost}
                          ></PostCard>
                        </div>
                      );
                    } else if (
                      typeof element.likes !== "undefined" &&
                      this.state.postsCheckbox && 
                      element.author === this.state.profileUser.username &&
                      this.state.searchInput !== ""
                    ) {
                      var match = 0;
                      const searchQuery = this.state.searchInput.toLowerCase();
                      if (
                        element.title.toLowerCase().indexOf(searchQuery) !==
                          -1 ||
                        element.caption.toLowerCase().indexOf(searchQuery) !==
                          -1
                      ) {
                        match = 1;
                      }
                      if (match === 1) {
                        return (
                          <div className="card" key={uid(element)}>
                            <PostCard
                              post={element}
                              homeComponent={this}
                              appState={appState}
                              selectPost={this.toggleModalPost}
                            ></PostCard>
                          </div>
                        );
                      }
                    } else if (
                      // Created Trails
                      typeof element.strava !== "undefined" &&
                      this.state.trailsCheckbox &&
                      element.author === this.state.profileUser.username &&
                      !this.state.followingTrails.includes(element._id) &&
                      this.state.searchInput === ""
                    ) {
                      return (
                        <div className="card" key={uid(element)}>
                          <TrailCard
                            trail={element}
                            trailComponent={this}
                            appState={appState}
                            selectTrail={this.toggleModalTrail}
                          ></TrailCard>
                        </div>
                      );
                    } else if (
                      // Created Trails
                      typeof element.strava !== "undefined" &&
                      this.state.trailsCheckbox &&
                      element.author === this.state.profileUser.username &&
                      !this.state.followingTrails.includes(element._id) &&
                      this.state.searchInput !== ""
                    ) {
                      var match = 0;
                      const searchQuery = this.state.searchInput.toLowerCase();
                      if (
                        element.title.toLowerCase().indexOf(searchQuery) !== -1
                      ) {
                        match = 1;
                      }
                      if (match === 1) {
                        return (
                          <div className="card" key={uid(element)}>
                            <TrailCard
                              trail={element}
                              trailComponent={this}
                              appState={appState}
                              selectTrail={this.toggleModalTrail}
                            ></TrailCard>
                          </div>
                        );
                      }
                    } else if (
                      // Followed Trails
                      typeof element.strava !== "undefined" &&
                      this.state.createdTrailsCheckbox &&
                      element.author !== this.state.profileUser.username &&
                      this.state.followingTrails.includes(element._id) &&
                      this.state.searchInput === ""
                    ) {
                      return (
                        <div className="card" key={uid(element)}>
                          <TrailCard
                            trail={element}
                            trailComponent={this}
                            appState={appState}
                            selectTrail={this.toggleModalTrail}
                          ></TrailCard>
                        </div>
                      );
                    } else if (
                      // Followed Trail
                      typeof element.strava !== "undefined" &&
                      this.state.createdTrailsCheckbox &&
                      element.author !== this.state.profileUser.username &&
                      this.state.followingTrails.includes(element._id) &&
                      this.state.searchInput !== ""
                    ) {
                      var match = 0;
                      const searchQuery = this.state.searchInput.toLowerCase();
                      if (
                        element.title.toLowerCase().indexOf(searchQuery) !== -1
                      ) {
                        match = 1;
                      }
                      if (match === 1) {
                        return (
                          <div className="card" key={uid(element)}>
                            <TrailCard
                              trail={element}
                              trailComponent={this}
                              appState={appState}
                              selectTrail={this.toggleModalTrail}
                            ></TrailCard>
                          </div>
                        );
                      }
                    } else if (
                      // element instanceof Bike &&
                      typeof element.model !== "undefined" &&
                      this.state.ownedBikesCheckbox &&
                      element.owner === this.state.profileUser.username &&
                      this.state.searchInput === ""
                    ) {
                      return (
                        <div key={uid(element)} className="card">
                          <BikeCard
                            bike={element}
                            bikeComponent={this}
                            appState={appState}
                            selectBike={this.toggleModalBike}
                          ></BikeCard>
                        </div>
                      );
                    } else if (
                      typeof element.model !== "undefined" &&
                      this.state.ownedBikesCheckbox &&
                      element.owner === this.state.profileUser.username &&
                      this.state.searchInput !== ""
                    ) {
                      const searchQuery = this.state.searchInput.toLowerCase();
                      if (
                        element.model.toLowerCase().indexOf(searchQuery) !==
                          -1 ||
                        element.description
                          .toLowerCase()
                          .indexOf(searchQuery) !== -1
                      ) {
                        match = 1;
                      }
                      if (match === 1) {
                        return (
                          <div className="card" key={uid(element)}>
                            <BikeCard
                              bike={element}
                              bikeComponent={this}
                              appState={appState}
                              selectBike={this.toggleModalBike}
                            ></BikeCard>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          {this.state.selectedPost && (
            <PostModal
              post={this.state.selectedPost}
              toggleModal={this.toggleModalPost}
            ></PostModal>
          )}

          {this.state.selectedTrail && (
            <TrailModal
              selectedTrail={this.state.selectedTrail}
              toggleModal={this.toggleModalTrail}
            />
          )}

          {this.state.selectedBike && (
            <BikeModal
              selectedBike={this.state.selectedBike}
              toggleModal={this.toggleModalBike}
            />
          )}

          {/* Edit Profile Popup */}
          <Modal
            open={this.state.editModalOpen}
            onClose={() => this.setState({ editModalOpen: false })}
            className="edit"
          >
            <Box sx={editStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Edit Profile Information
              </Typography>

              <Grid className="editForm1" container spacing={4} columns={3}>
                <Grid item xs={3} align="center">
                  <TextField
                    id="filled-basic"
                    label="Name"
                    variant="outlined"
                    defaultValue={this.state.userName}
                    onChange={this.handleInputChange}
                    name="userName"
                    inputProps={{ maxLength: 25 }}
                  />
                </Grid>

                <Grid item xs={3} align="center">
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                      value={this.state.userGender}
                      label="Gender"
                      name="userGender"
                      onChange={this.handleInputChange}
                    >
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                      <MenuItem value={"Non-binary"}>Non-binary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3} align="center">
                  <TextField
                    id="filled-basic"
                    label="Location"
                    variant="outlined"
                    defaultValue={this.state.userLocation}
                    onChange={this.handleInputChange}
                    name="userLocation"
                    inputProps={{ maxLength: 30 }}
                  />
                </Grid>
              </Grid>

              <Grid className="editForm2" container spacing={4} columns={3}>
                <Grid item xs={12} align="center">
                  <TextField
                    id="filled-basic"
                    label="Description"
                    variant="outlined"
                    defaultValue={this.state.userDescription}
                    onChange={this.handleInputChange}
                    name="userDescription"
                    InputProps={{ inputProps: { maxLength: 125 } }}
                    multiline
                    rows={5}
                    maxRows={5}
                    style={{ width: "80%" }}
                  />
                </Grid>
              </Grid>

              <Grid className="editForm3" container spacing={2}>
                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    onClick={() => editUserSubmission(this)}
                    className="submitButton"
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Dialog open={this.state.editAlert} onClose={this.editAlertClose}>
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              Changes have been made.
            </Alert>
          </Dialog>

          {/* Edit Profile Pic Popup */}
          <Modal
            open={this.state.editProfilePicModalOpen}
            onClose={() => this.setState({ editProfilePicModalOpen: false })}
            className="edit"
          >
            <Box sx={profilePicEditStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Edit Profile Picture
              </Typography>

              <Grid item xs={1} align="center">
                <Button
                  variant="contained"
                  component="label"
                  onChange={this.onFileChangeProfilePic}
                  color="secondary"
                >
                  Upload File
                  <input type="file" hidden />
                </Button>
              </Grid>

              <Grid className="editForm3" container spacing={2}>
                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    onClick={() => editProfilePicSubmission(this)}
                    className="submitButton"
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          {/* Add Trail Popup */}

          <Modal
            open={this.state.trailModalOpen}
            onClose={() => this.setState({ trailModalOpen: false })}
            className="edit"
          >
            <Box sx={trailStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Add Trail Post
              </Typography>

              <Grid className="trail-form1" container spacing={4} columns={3}>
                <Grid item xs={12} align="center">
                  <TextField
                    id="filled-basic"
                    label="Title"
                    variant="outlined"
                    value={this.state.trailTitle}
                    onChange={this.handleInputChange}
                    name="trailTitle"
                    inputProps={{ maxLength: 25 }}
                    style={{ width: "51%" }}
                  />
                </Grid>
              </Grid>

              {this.state.searchedTrail && (
                <Grid className="trail-form1" container spacing={4} columns={3}>
                  <Grid item xs={12} align="center">
                    <Box
                      xs={{ display: "flex" }}
                      onMouseEnter={(e) => (e.target.style.color = "blue")}
                      onMouseLeave={(e) => (e.target.style.color = "black")}
                    >
                      <p style={{ paddingLeft: "25%", textAlign: "left" }}>
                        Are you looking for: {this.state.searchedTrail.title}
                      </p>
                    </Box>
                  </Grid>
                </Grid>
              )}

              <Grid className="trail-form2" container spacing={3}>
                <Grid item xs={4} align="center">
                  <InputMask
                    mask="99:99:99"
                    value={this.state.trailTime}
                    onChange={this.handleInputChange}
                    disabled={false}
                  >
                    {() => (
                      <TextField
                        id="filled-basic"
                        name="trailTime"
                        label="Time"
                        variant="outlined"
                        type="text"
                        style={{ width: "50%" }}
                      />
                    )}
                  </InputMask>
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="outlined-basic"
                    label="Rating"
                    variant="outlined"
                    value={this.state.trailRating}
                    onChange={this.handleInputChange}
                    name="trailRating"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: 5, maxLength: 1 },
                    }}
                    style={{ width: "50%" }}
                  />
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="outlined-basic"
                    label="Strava Link"
                    variant="outlined"
                    value={this.state.stravaLink}
                    onChange={this.handleInputChange}
                    name="stravaLink"
                    type="text"
                    style={{ width: "50%" }}
                  />
                </Grid>
              </Grid>

              <Grid
                className="trail-form3"
                container
                spacing={2}
                style={{ marginTop: "5%" }}
              >
                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    onChange={this.onFileChangeTrail}
                    color="secondary"
                  >
                    Upload File
                    <input type="file" hidden />
                  </Button>
                </Grid>

                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() => addTrail(this, this.state.currentUser)}
                    color="primary"
                  >
                    Add Trail
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Dialog open={this.state.uploadAlert} onClose={this.uploadAlertClose}>
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              Photo has been uploaded.
            </Alert>
          </Dialog>

          <Dialog
            open={this.state.trailPostSuccess}
            onClose={this.trailPostSuccessClose}
          >
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              Trail has been posted.
            </Alert>
          </Dialog>

          <Dialog open={this.state.postFail} onClose={this.postFailClose}>
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              One or more of the fields are missing information. Also, dont
              forget to upload a picture!
            </Alert>
          </Dialog>

          {/* Add Bike Popup */}

          <Modal
            open={this.state.bikeModalOpen}
            onClose={() => this.setState({ bikeModalOpen: false })}
            className="create"
          >
            <Box sx={bikeStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Add Bike Post
              </Typography>

              <Grid className="bike-form1" container spacing={4} columns={3}>
                <Grid item xs={4} align="center">
                  <TextField
                    id="filled-basic"
                    label="Model"
                    variant="outlined"
                    value={this.state.bikeModel}
                    onChange={this.handleInputChange}
                    name="bikeModel"
                    inputProps={{ maxLength: 25 }}
                    style={{ width: "60%" }}
                  />
                </Grid>

                <Grid item xs={4} align="center">
                  {/* Done with the help of this post: https://stackoverflow.com/questions/45758998/how-can-i-mask-my-material-ui-textfield */}

                  <InputMask
                    mask="(999) 999-9999"
                    value={this.state.bikeContactNumber}
                    onChange={this.handleInputChange}
                    disabled={false}
                  >
                    {() => (
                      <TextField
                        id="filled-basic"
                        name="bikeContactNumber"
                        label="Contact"
                        variant="outlined"
                        type="text"
                        style={{ width: "60%" }}
                      />
                    )}
                  </InputMask>
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="filled-basic"
                    label="Price"
                    variant="outlined"
                    value={this.state.bikePrice}
                    onChange={this.handleInputChange}
                    name="bikePrice"
                    type="number"
                    style={{ width: "60%" }}
                    InputProps={{
                      inputProps: { min: 0, max: 9999, maxLength: 25 },
                    }}
                  />
                </Grid>

                <Grid item xs={4} align="center">
                  <InputMask
                    mask="99-99-9999"
                    value={this.state.bikePurchased}
                    onChange={this.handleInputChange}
                    disabled={false}
                  >
                    {() => (
                      <TextField
                        id="filled-basic"
                        name="bikePurchased"
                        label="Purchased (mm-dd-yyyy)"
                        variant="outlined"
                        type="text"
                        style={{ width: "60%" }}
                      />
                    )}
                  </InputMask>
                </Grid>
              </Grid>

              <Grid className="bike-form2" container spacing={4} columns={3}>
                <Grid item xs={12} align="center">
                  <TextField
                    id="filled-basic"
                    label="Description"
                    variant="outlined"
                    value={this.state.bikeDescription}
                    onChange={this.handleInputChange}
                    name="bikeDescription"
                    inputProps={{ maxLength: 55 }}
                    multiline
                    rows={5}
                    maxRows={5}
                    style={{ width: "80%" }}
                  />
                </Grid>
              </Grid>

              <Grid className="bike-form3" container align="center">
                <Grid item xs={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="For Sale"
                      onChange={this.handleInputChange}
                      name="bikeSale"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    component="label"
                    onChange={this.onFileChangeBike}
                    color="secondary"
                  >
                    Upload File
                    <input type="file" hidden />
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() => addBike(this, appState.user.username)}
                    color="primary"
                  >
                    Add Bike
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Dialog open={this.state.uploadAlert} onClose={this.uploadAlertClose}>
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              Photo has been uploaded.
            </Alert>
          </Dialog>

          <Dialog
            open={this.state.bikePostSuccess}
            onClose={this.bikePostSuccessClose}
          >
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              Bike has been posted.
            </Alert>
          </Dialog>

          <Dialog open={this.state.postFail} onClose={this.postFailClose}>
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              One or more of the fields are missing information. Also, dont
              forget to upload a picture!
            </Alert>
          </Dialog>

          {/* EDIT BIKE */}

          <Modal
            open={this.state.editBikeModalOpen}
            onClose={this.editBikeModalClose}
            className="create"
          >
            <Box sx={editBikeStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Edit Bike Post
              </Typography>

              <Grid className="bike-form1" container spacing={4} columns={3}>
                <Grid item xs={4} align="center">
                  <TextField
                    id="filled-basic"
                    label="Model"
                    variant="outlined"
                    defaultValue={this.state.bikeModel}
                    onChange={this.handleInputChange}
                    name="bikeModel"
                    inputProps={{ maxLength: 25 }}
                    style={{ width: "60%" }}
                  />
                </Grid>

                <Grid item xs={4} align="center">
                  {/* Done with the help of this post: https://stackoverflow.com/questions/45758998/how-can-i-mask-my-material-ui-textfield */}

                  <InputMask
                    mask="(999) 999-9999"
                    defaultValue={this.state.bikeContactNumber}
                    onChange={this.handleInputChange}
                    disabled={false}
                  >
                    {() => (
                      <TextField
                        id="filled-basic"
                        name="bikeContactNumber"
                        label="Contact"
                        variant="outlined"
                        type="text"
                        style={{ width: "60%" }}
                      />
                    )}
                  </InputMask>
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="filled-basic"
                    label="Price"
                    variant="outlined"
                    defaultValue={this.state.bikePrice}
                    onChange={this.handleInputChange}
                    name="bikePrice"
                    type="number"
                    style={{ width: "60%" }}
                    InputProps={{
                      inputProps: { min: 0, max: 9999, maxLength: 25 },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid className="bike-form2" container spacing={4} columns={3}>
                <Grid item xs={12} align="center">
                  <TextField
                    id="filled-basic"
                    label="Description"
                    variant="outlined"
                    defaultValue={this.state.bikeDescription}
                    onChange={this.handleInputChange}
                    name="bikeDescription"
                    inputProps={{ maxLength: 55 }}
                    multiline
                    rows={5}
                    maxRows={5}
                    style={{ width: "80%" }}
                  />
                </Grid>
              </Grid>

              <Grid className="bike-form3" container align="center">
                <Grid item xs={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="For Sale"
                      onChange={this.handleInputChange}
                      checked={this.state.bikeSale}
                      name="bikeSale"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() => editBikeSubmission(this)}
                    color="primary"
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          {/* EDIT POST */}

          <Modal
            w
            open={this.state.editPostModalOpen}
            onClose={this.editPostModalClose}
            className="create"
          >
            <Box sx={editStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Edit Post
              </Typography>

              <Grid className="post-form1" container spacing={4} columns={3}>
                <Grid item xs={12} align="center">
                  <TextField
                    id="filled-basic"
                    label="Title"
                    variant="outlined"
                    defaultValue={this.state.postTitle}
                    onChange={this.handleInputChange}
                    name="postTitle"
                    inputProps={{ maxLength: 25 }}
                    style={{ width: "60%" }}
                  />
                </Grid>
              </Grid>

              <Grid className="post-form2" container spacing={3}>
                <Grid item xs={4} align="center">
                  <TextField
                    id="outlined-basic"
                    label="Caption"
                    variant="outlined"
                    defaultValue={this.state.postCaption}
                    onChange={this.handleInputChange}
                    name="postCaption"
                    inputProps={{ maxLength: 55 }}
                    style={{ width: "80%" }}
                    multiline
                    rows={2}
                    maxRows={2}
                  />
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="outlined-basic"
                    label="Content"
                    variant="outlined"
                    defaultValue={this.state.postContent}
                    onChange={this.handleInputChange}
                    name="postContent"
                    inputProps={{ maxLength: 120 }}
                    style={{ width: "80%" }}
                    multiline
                    rows={2}
                    maxRows={2}
                  />
                </Grid>
              </Grid>

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
                    onClick={() => editPostSubmission(this)}
                    color="primary"
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Modal
            open={this.state.editTrailModalOpen}
            onClose={this.editTrailModalClose}
            className="create"
          >
            <Box sx={trailStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Edit Trail Post
              </Typography>

              <Grid className="trail-form1" container spacing={4} columns={3}>
                <Grid item xs={12} align="center">
                  <TextField
                    id="filled-basic"
                    label="Title"
                    variant="outlined"
                    defaultValue={this.state.trailTitle}
                    onChange={this.handleInputChange}
                    name="trailTitle"
                    inputProps={{ maxLength: 25 }}
                    style={{ width: "51%" }}
                  />
                </Grid>
              </Grid>

              <Grid className="trail-form2" container spacing={3}>
                <Grid item xs={4} align="center">
                  <InputMask
                    mask="99:99:99"
                    value={this.state.trailTime}
                    onChange={this.handleInputChange}
                    disabled={false}
                  >
                    {() => (
                      <TextField
                        id="filled-basic"
                        name="trailTime"
                        label="Time"
                        variant="outlined"
                        type="text"
                        style={{ width: "50%" }}
                      />
                    )}
                  </InputMask>
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="outlined-basic"
                    label="Rating"
                    variant="outlined"
                    value={this.state.trailRating}
                    onChange={this.handleInputChange}
                    name="trailRating"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: 5, maxLength: 1 },
                    }}
                    style={{ width: "50%" }}
                  />
                </Grid>

                <Grid item xs={4} align="center">
                  <TextField
                    id="outlined-basic"
                    label="Strava Link"
                    variant="outlined"
                    value={this.state.stravaLink}
                    onChange={this.handleInputChange}
                    name="stravaLink"
                    type="text"
                    style={{ width: "50%" }}
                  />
                </Grid>

                <Grid
                  className="trail-form3"
                  container
                  spacing={2}
                  style={{ marginTop: "5%" }}
                >
                  <Grid item xs={3} align="center">
                    <Button
                      variant="contained"
                      component="label"
                      onClick={() => editTrailSubmission(this)}
                      color="primary"
                    >
                      Confirm
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          {/* EDIT DIALOGS */}

          <Dialog open={this.state.editSuccess} onClose={this.editSuccessClose}>
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              Changes have been made.
            </Alert>
          </Dialog>

          <Dialog open={this.state.editFail} onClose={this.editFailClose}>
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              One or more of the fields are missing information.
            </Alert>
          </Dialog>
        </div>
      </div>
    );
  }
}
export default withRouter(Profile);

//export default Profile;
