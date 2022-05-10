import React from "react";
import "./Trail.css";
import TrailModal from "./TrailModal";
import TrailCard from "./TrailCard";
import InputMask from "react-input-mask";
import { uid } from "react-uid";

// Importing actions/required methods
import {
  addTrail,
  sortFilter,
  editTrailSubmission,
  suggestTrail,
  findTrail,
  addUserToTrail,
  getTrails,
} from "../../actions/trail";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

/* Component for the Trail page */
class Trail extends React.Component {
  state = {
    trailTitle: "",
    trailTime: "",
    trailRating: "",
    trailPicture: null,
    stravaLink: "",

    trailModalOpen: false,
    uploadAlert: false,
    trailPostSuccess: false,
    postFail: false,
    editSuccess: false,
    editFail: false,
    editTrailModalOpen: false,
    trailToEdit: "",

    searchFilter: "",
    sortFilter: "date",
    trails: [], //Data.data.trails,
    num_trails: 0,
    selectedTrail: null,
    searchedTrail: null,
    existingTrail: null,
  };

  componentDidMount() {
    getTrails(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // only update chart if the data has changed

    if (prevState.num_trails !== this.state.num_trails || prevState.editSuccess !== this.state.editSuccess || this.state.trailPostSuccess)  {
      getTrails(this);
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "trailTime") {
      if (value === "" || value === "__:__:__") {
        this.setState({
          [name]: "",
        });
      } else {
        this.setState({
          [name]: value,
        });
      }
    } else if (name === "trailRating") {
      if (value === "") {
        this.setState({
          [name]: 0,
        });
      } else {
        this.setState({
          [name]: parseInt(value),
        });
      }
    } else if (name === "trailTitle") {
      const searchedTrail = suggestTrail(value, this.state.trails);
      const existingTrail = findTrail(value, this.state.trails);

      this.setState({
        [name]: value,
        searchedTrail: searchedTrail,
        existingTrail: existingTrail,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  setSearchTitle = (title) => {
    this.setState({
      trailTitle: title,
    });
  };

  useSuggestion = (trail) => {
    this.setSearchTitle(trail.title);
    this.setState({
      existingTrail: trail,
    });
  };

  toggleModal = (trail) => {
    this.setState({
      selectedTrail: trail,
    });
  };

  handleCreateOpen = () => this.setState({ trailModalOpen: true });
  handleCreateClose = () => this.setState({ trailModalOpen: false });
  handleEditClose = () => this.setState({ editTrailModalOpen: false });

  uploadAlertClose = () => this.setState({ uploadAlert: false });
  postSuccessClose = () => this.setState({ trailPostSuccess: false });
  postFailClose = () => this.setState({ postFail: false });

  editSuccessClose = () => this.setState({ editSuccess: false });
  editFailClose = () => this.setState({ editFail: false });

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
        trailPicture: reader.result,
        uploadAlert: true,
      });
    };
    reader.readAsDataURL(file);
  };

  render() {
    const { appState } = this.props;
   
    return (
        <div>
        <Button
          onClick={this.handleCreateOpen}
          name="modalOpen"
          variant="contained"
          id="createButton"
          color="primary"
        >
          ADD TRAIL POST
        </Button>

        <Modal
          open={this.state.trailModalOpen}
          onClose={this.handleCreateClose}
          className="create"
        >
          <Box sx={style}>
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
                    onClick={() => {
                      this.useSuggestion(this.state.searchedTrail);
                    }}
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
                  InputProps={{ inputProps: { min: 0, max: 5, maxLength: 1 } }}
                  style={{ width: "50%" }}
                />
              </Grid>

              {!this.state.existingTrail && (
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
              )}
            </Grid>

            <Grid
              className="trail-form3"
              container
              spacing={2}
              style={{ marginTop: "5%" }}
            >
              {!this.state.existingTrail && (
                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    onChange={this.onFileChange}
                    color="secondary"
                  >
                    Upload File
                    <input type="file" hidden />
                  </Button>
                </Grid>
              )}

              {!this.state.existingTrail && (
                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() => addTrail(this, appState.user)}
                    color="primary"
                  >
                    Add Trail
                  </Button>
                </Grid>
              )}

              {this.state.existingTrail && (
                <Grid item xs={3} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() =>
                      addUserToTrail(
                        this,
                        appState.user._id, 
                        this.state.existingTrail
                      )
                    }
                    color="primary"
                  >
                    Add Entry
                  </Button>
                </Grid>
              )}
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
          onClose={this.postSuccessClose}
        >
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>
            Trail has been posted.
          </Alert>
        </Dialog>

        <Dialog open={this.state.postFail} onClose={this.postFailClose}>
          <Alert severity="error">
            <AlertTitle>Error!</AlertTitle>
            One or more of the fields are missing information. Also, dont forget
            to upload a picture!
          </Alert>
        </Dialog>
        

        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 2 }}
        >
          <Grid item xs={7} sm={6} md={5} lg={4} xl={2} className="searchBar">
            <SearchIcon sx={{ color: "action.active", mr: 1, my: 2.5 }} />

            <TextField
              id="standard-basic"
              label="Search"
              variant="standard"
              value={this.state.searchFilter}
              onChange={this.handleInputChange}
              name="searchFilter"
              style={{ width: "60%" }}
            />
          </Grid>

          <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="sortFilter">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort</InputLabel>
              <Select
                value={this.state.sortFilter}
                label="Sort"
                name="sortFilter"
                onChange={this.handleInputChange}
              >
                <MenuItem value={"date"}>Date Posted [Latest]</MenuItem>
                <MenuItem value={"name"}>Name [Alphabetical A-Z]</MenuItem>
                <MenuItem value={"rating"}>Rating [Decreasing]</MenuItem>
                <MenuItem value={"time"}>Duration [Decreasing]</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        { (this.state.trails.length === 0 && 
             <div style= {{ display: "flex", flexDirection: 'column', justifyContent:'center', alignItems: 'center', width: "100vw", minHeight: "100vh" , overflowY:"scroll" , fontSize: '20px'}}>
          <p>Loading Trails...</p>
          <span  style= {{  fontSize: '15px', color: 'grey'}}>No Trails</span>
        </div>
        )}

        {(this.state.trails.length !== 0 && 
      
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 2 }}
          align="center"
        >
          {sortFilter(this.state.trails, this.state)
            .filter((t) =>
              t.title
                .toLowerCase()
                .includes(this.state.searchFilter.toLowerCase())
            )
            .map((trail) => {
              return (
                <Grid
                  item
                  xs={7}
                  sm={6}
                  md={5}
                  lg={4}
                  xl={3}
                  key={uid(trail)}
                  align="center"
                >
                  <TrailCard
                    trail={trail}
                    trailComponent={this}
                    appState={appState}
                    selectTrail={this.toggleModal}
                  ></TrailCard>
                </Grid>
              );
            })}
        </Grid>
        
        )}
        <Modal
          open={this.state.editTrailModalOpen}
          onClose={this.handleEditClose}
          className="create"
        >
          <Box sx={style}>
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
                  InputProps={{ inputProps: { min: 0, max: 5, maxLength: 1 } }}
                  style={{ width: "50%" }}
                />
              </Grid>

              <Grid item xs={4} align="center">
                <TextField
                  id="outlined-basic"
                  label="Strava Link"
                  variant="outlined"
                  defaultValue={this.state.stravaLink}
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

        {this.state.selectedTrail && (
          <TrailModal
            selectedTrail={this.state.selectedTrail}
            toggleModal={this.toggleModal}
          />
        )}
      </div>
    
    );
  }
   
}
export default Trail;
