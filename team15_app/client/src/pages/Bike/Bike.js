import React from "react";
import "./Bike.css";
import BikeCard from "./BikeCard";
import BikeModal from "./BikeModal";
import InputMask from "react-input-mask";
import { uid } from "react-uid";

// Importing actions/required methods
import { addBike, editBikeSubmission, sortFilter, getBikes } from "../../actions/bike.js";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
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

const style = {
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

/* Component for the Bike page */
class Bike extends React.Component {
  state = {
    bikeModel: "",
    bikeDescription: "",
    bikeContactNumber: "",
    bikePrice: "",
    bikePurchased: "",
    bikeSale: true,
    bikePicture: null,

    bikeModalOpen: false,
    uploadAlert: false,
    bikePostSuccess: false,
    postFail: false,
    editSuccess: false,
    editFail: false,
    editBikeModalOpen: false,
    bikToEdit: "",

    searchFilter: "",
    sortFilter: "date",
    saleFilter: false,
    bikes: [],
    num_bikes: 0,
    selectedBike: null,
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "bikeSale") {
      this.setState({
        [name]: !this.state.bikeSale,
      });
    } else if (name === "saleFilter") {
      this.setState({
        [name]: !this.state.saleFilter,
      });
    } else if (name === "bikePrice") {
      if (value === "") {
        this.setState({
          [name]: 0,
        });
      } else {
        this.setState({
          [name]: parseInt(value),
        });
      }
    } else if (name === "bikeContactNumber") {
      if (value === "" || value === "(___) ___-____") {
        this.setState({
          [name]: "",
        });
      } else {
        this.setState({
          [name]: value,
        });
      }
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  handleCreateOpen = () => this.setState({ bikeModalOpen: true });
  handleCreateClose = () => this.setState({ bikeModalOpen: false });
  handleEditClose = () => this.setState({ editBikeModalOpen: false });

  uploadAlertClose = () => this.setState({ uploadAlert: false });
  postSuccessClose = () => this.setState({ bikePostSuccess: false });
  postFailClose = () => this.setState({ postFail: false });

  editSuccessClose = () => this.setState({ editSuccess: false });
  editFailClose = () => this.setState({ editFail: false });

  toggleModal = (bike) => {
    this.setState({
      selectedBike: bike,
    });
  };

  // Help from: https://stackoverflow.com/questions/43992427/how-to-display-a-image-selected-from-input-type-file-in-reactjs

  onFileChange = (event) => {
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

  cardFilter = (b) => {
    if (this.state.saleFilter === true) {
      if (
        b.model.toLowerCase().includes(this.state.searchFilter.toLowerCase()) &&
        b.canBuy === true
      ) {
        return true;
      }
    } else if (
      b.model.toLowerCase().includes(this.state.searchFilter.toLowerCase())
    ) {
      return true;
    }
  };

  componentDidMount() {
    getBikes(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // only update chart if the data has changed

    if (prevState.num_bikes !== this.state.num_bikes || prevState.editSuccess !== this.state.editSuccess)  {
      getBikes(this);
    }
  }

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
          ADD BIKE POST
        </Button>

        <Modal
          open={this.state.bikeModalOpen}
          onClose={this.handleCreateClose}
          className="create"
        >
          <Box sx={style}>
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

              <Grid item xs={6} align="center">
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
                  onChange={this.onFileChange}
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
          onClose={this.postSuccessClose}
        >
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>
            Bike has been posted.
          </Alert>
        </Dialog>

        <Dialog open={this.state.postFail} onClose={this.postFailClose}>
          <Alert severity="error">
            <AlertTitle>Error!</AlertTitle>
            One or more of the fields are missing information. Also, dont forget
            to upload a picture and double check the date format!
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

          <Grid item xs={1} sm={1} md={2} lg={2} xl={1} className="saleFilter">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                item
                m={2}
                label="For Sale"
                name="saleFilter"
                onChange={this.handleInputChange}
              />
            </FormGroup>
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
                <MenuItem value={"price"}>Price [Decreasing]</MenuItem>
                <MenuItem value={"model"}>Model [Alphabetical A-Z]</MenuItem>
                <MenuItem value={"purchase"}>Date Purchased [Latest]</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* DISPLAY ALL BIKE CARDS */}
        { (this.state.bikes.length === 0 && 
             <div style= {{ display: "flex", flexDirection: 'column', justifyContent:'center', alignItems: 'center', width: "100vw", minHeight: "100vh" , overflowY:"scroll" , fontSize: '20px'}}>
          <p>Loading Bikes...</p>
          <span  style= {{  fontSize: '15px', color: 'grey'}}>No Bikes</span>
        </div>
        )}

        {(this.state.bikes.length !== 0 && 
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 2 }}
          align="center"
        >
          {/* DB CALL WILL BE MADE HERE TO GET ALL TRAILS */}
          {sortFilter(this.state.bikes, this.state)
            .filter(this.cardFilter)
            .map((bike) => {
              return (
                <Grid
                  item
                  xs={7}
                  sm={6}
                  md={5}
                  lg={4}
                  xl={3}
                  key={uid(bike)}
                  align="center"
                >
                  <BikeCard
                    bike={bike}
                    bikeComponent={this}
                    appState={appState}
                    selectBike={this.toggleModal}
                  ></BikeCard>
                </Grid>
              );
            })}
        </Grid>)}

        {/* EDIT BIKE */}

        <Modal
          open={this.state.editBikeModalOpen}
          onClose={this.handleEditClose}
          className="create"
        >
          <Box sx={editStyle}>
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

              <Grid item xs={6}>
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

        {this.state.selectedBike && (
          <BikeModal
            selectedBike={this.state.selectedBike}
            toggleModal={this.toggleModal}
          />
        )}
      </div>
    );
  }
}
export default Bike;
