import React from "react";
import "./Home.css";
import Box from "@material-ui/core/Box";
import PostCard from "../../components/Post/PostCard.js";
import PostModal from "../../components/Post/PostModal.js";
import { uid } from "react-uid";

// Importing actions/required methods
import {
  addPost,
  editPostSubmission,
  sortFilter,
  getPosts,
  removePost,
} from "../../actions/home.js";
import Grid from "@material-ui/core/Grid";
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

// Importing server actions/required methods
//import { getStudents } from "../../actions/student";

const style = {
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

/* Component for the Home page */
class Home extends React.Component {

  state = {
    currentUser: this.props.appState.username,

    postTitle: "",
    postCaption: "",
    postContent: "",
    postPicture: null,

    modalOpen: false,
    uploadAlert: false,
    postSuccess: false,
    postFail: false,
    editSuccess: false,
    editFail: false,
    editPostModalOpen: false,
    postToEdit: "",

    searchFilter: "",
    sortFilter: "date",
    // posts: Data.data.posts,
    posts: [],
    num_posts: 0,
    selectedPost: null,
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleCreateOpen = () => this.setState({ modalOpen: true });
  handleCreateClose = () => this.setState({ modalOpen: false });

  handleEditClose = () => this.setState({ editPostModalOpen: false });

  uploadAlertClose = () => this.setState({ uploadAlert: false });
  postSuccessClose = () => this.setState({ postSuccess: false });
  postFailClose = () => this.setState({ postFail: false });

  editSuccessClose = () => this.setState({ editSuccess: false });
  editFailClose = () => this.setState({ editFail: false });

  toggleModal = (post) => {
    this.setState({
      selectedPost: post,
    });
  };

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
        postPicture: reader.result,
        uploadAlert: true,
      });
    };
    reader.readAsDataURL(file);
  };

  componentDidMount() {
    getPosts(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // only update chart if the data has changed
    console.log("running componentDidUpdate");

    if (
      prevState.num_posts !== this.state.num_posts ||
      prevState.editSuccess !== this.state.editSuccess
    ) {
      getPosts(this);
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
          ADD POST
        </Button>

        <Modal
          w
          open={this.state.modalOpen}
          onClose={this.handleCreateClose}
          className="create"
        >
          <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
              Add Post
            </Typography>

            <Grid className="post-form1" container spacing={4} columns={3}>
              <Grid item xs={12} align="center">
                <TextField
                  id="filled-basic"
                  label="Title"
                  variant="outlined"
                  value={this.state.postTitle}
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
                  value={this.state.postCaption}
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
                  value={this.state.postContent}
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
                  onChange={this.onFileChange}
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
                  onClick={() => addPost(this, appState.user.username)}
                  color="primary"
                >
                  Add Post
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

        <Dialog open={this.state.postSuccess} onClose={this.postSuccessClose}>
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>
            Your content has been posted.
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
                <MenuItem value={"date"}>Date [Latest]</MenuItem>
                <MenuItem value={"comments"}>Comments [Decreasing]</MenuItem>
                <MenuItem value={"likes"}>Likes [Decreasing]</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* DISPLAY ALL POST CARDS */}
        { (this.state.posts.length === 0 && 
             <div style= {{ display: "flex", flexDirection: 'column', justifyContent:'center', alignItems: 'center', width: "100vw", minHeight: "100vh" , overflowY:"scroll" , fontSize: '20px'}}>
          <p>Loading Posts...</p>
          <span  style= {{  fontSize: '15px', color: 'grey'}}>No Posts</span>
        </div>
        )}
        {(this.state.posts.length !== 0 &&
      <div>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 2 }}
          align="center"
        >
          {/* DB CALL WILL BE MADE HERE TO GET ALL TRAILS */}
          {sortFilter(this.state.posts, this.state)
            .filter((p) =>
              p.title
                .toLowerCase()
                .includes(this.state.searchFilter.toLowerCase())
            )
            .map((post) => {
              return (
                <Grid item xs={7} sm={6} md={5} lg={4} xl={3} key={uid(post)}>
                  <PostCard
                    post={post}
                    homeComponent={this}
                    appState={appState}
                    selectPost={this.toggleModal}
                  ></PostCard>
                </Grid>
              );
            })}
        </Grid>
        </div>)}
        {/* EDIT POST */}

        <Modal
          w
          open={this.state.editPostModalOpen}
          onClose={this.handleEditClose}
          className="create"
        >
          <Box sx={style}>
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

        {this.state.selectedPost && (
          <PostModal
            post={this.state.selectedPost}
            currentUser={appState.user.username}
            toggleModal={this.toggleModal}
          ></PostModal>
        )}

        {console.log(this.state)}
      </div>
    );
  }
}
export default Home;
