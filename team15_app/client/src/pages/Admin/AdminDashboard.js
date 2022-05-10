import React from "react";
import PostCard from "../../components/Post/PostCard";
import PostModal from "../../components/Post/PostModal";
import TrailCard from "../Trail/TrailCard";
import TrailModal from "../Trail/TrailModal";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { Paper } from "@mui/material";
import { List } from "@mui/material";
import IconButton from "@material-ui/core/IconButton";
import { uid } from "react-uid";
import "./AdminDashboard.css";
import { removeUserInfo } from "../../actions/UserInfo";

import {
  removeTrail,
  editTrail,
  getAvgTime,
  getAvgRating,
  followTrail,
  unfollowTrail,
  getUser,
} from "../../actions/trail";

import {
  addBike,
  editBikeSubmission,
  sortFilter,
  getBikes,
} from "../../actions/bike.js";

import { getPosts } from "../../actions/home.js";
import { getTrails } from "../../actions/trail.js";

import { getUsers, removeUser } from "../../actions/users.js";
import {
  LocalConvenienceStoreOutlined,
  ThirtyFpsSelect,
} from "@mui/icons-material";

/* Component for the Admin Dasboard page */
class AdminDashboard extends React.Component {
  // connect to data to get user number and likes numbers etc
  state = {
    // Get users,posts,trails from server
    // code below requires server call
    users: [],
    posts: [],
    user_number: 0,
    num_posts: 0,
    num_trails: 0,
    trails: [],
    selectTrail: false,
    likes: 0,
    comments: 0,
    userFilter: "",
    usersSelected: [],
    currentUser: this.props.appState.user,
    postDisplay: "center",
    isFetching: true,
  };

  componentDidMount() {
    getUsers(this);
    getPosts(this);
    getTrails(this);
    this.totalComments();
    this.totalLikes();
    this.handlePostDisplay();

  }

  componentDidUpdate(prevProps, prevState) {
    console.log("running componentDidUpdate");
    console.log("current user ", this.state.currentUser);

    if (prevState.posts !== this.state.posts) {
        this.totalLikes();
        this.totalComments();
        this.setState({ isFetching: false });
    }
    if (prevState.trails !== this.state.trails) {
      this.totalComments();
      this.setState({ isFetching: false });
    }
  
    if (prevState.num_posts !== this.state.num_posts) {
      getPosts(this);
      this.setState({ isFetching: false });
      this.totalLikes();
    }
    if (prevState.user_number !== this.state.user_number) {
      getUsers(this);
      this.totalLikes();
      this.setState({ isFetching: false });
    }
    if (prevState.num_posts !== this.state.num_posts) {
    
      getPosts(this);
      this.totalLikes();
      this.totalComments();
      this.handlePostDisplay();
      this.setState({ isFetching: false });
    }
    if (prevState.num_trails !== this.state.num_trails) {
      getTrails(this);
      this.totalComments();
      this.setState({ isFetching: false });
    }
    
  }

  handlePostDisplay() {
    let style =
      this.state.posts.filter(
        (p) => p.author === this.state.currentUser.username
      ).length <= 1
        ? "center"
        : "start";
    this.setState({
      postDisplay: style,
    });
  }

  totalLikes() {
    let counter = 0;
    this.state.posts.forEach((element) => {
      counter += element.likes;
    });
    this.setState({ likes: counter });
  }

  totalComments() {
    let counter = 0;
    this.state.posts.forEach((element) => {
      counter += element.comments.length;
    });
    this.setState({ comments: counter });
  }


  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  toggleModal = (post) => {
    this.setState({
      selectedPost: post,
    });
  };
  toggleModalTrail = (trail) => {
    this.setState({
      selectedTrail: trail,
    });
  };

  render() {
    const { appState } = this.props;
    if (this.state.isFetching) {
      return <div style= {{ display: "flex", flexDirection: 'column', justifyContent:'center', alignItems: 'center', width: "100vw", minHeight: "100vh" , overflowY:"scroll" , fontSize: '20px'}}>
         Loading Data....</div>;
    }
    return (
      <div id="dashboard">
        <div id="userInsightsContainer">
          <div className="insightBox">
            <p>USERS</p>

            <p className="metrics">{this.state.user_number}</p>
          </div>
          <div className="insightBox">
            <p>POSTS</p>
            <p className="metrics">{this.state.num_posts}</p>
          </div>
          <div className="insightBox">
            <p>Trails</p>
            <p className="metrics">{this.state.num_trails}</p>
          </div>
          <div className="insightBox">
            <p>LIKES</p>
            <p className="metrics">{this.state.likes}</p>
          </div>
          <div className="insightBox">
            <p>COMMENTS</p>
            <p className="metrics">{this.state.comments}</p>
          </div>
        </div>

        <div id="sidesContainer">
          <div id="leftContainer">
            <div id="usersListContainer">
              <div id="searchUsersBar">
                <SearchIcon
                  id="searchIcon"
                  sx={{ color: "action.active", mr: 1, my: 1 }}
                />
                <TextField
                  id="searchBar"
                  fullWidth
                  label="Search Users"
                  variant="standard"
                  value={this.state.postFilter}
                  onChange={this.handleInputChange}
                  name="userFilter"
                />
              </div>

              <div id="userList">
                <Paper className="paperList">
                  <List id="usersList" sx={{ width: "100%", maxHeight: 360 }}>
                    <div>
                      <table id="userListingStyle">
                        <tr>
                          <th className="listCell">Username </th>
                          <th className="listCell"> Role </th>
                          <th className="listCell"> Edit </th>
                        </tr>
                      </table>
                      {/* to lowercase */}
                      {this.state.usersSelected
                        .filter((x) =>
                          x.username.includes(this.state.userFilter)
                        )
                        .map((user) => {
                          return (
                            <div key={user.id}>
                              <div id="rowStyle">
                                <table
                                  key={uid(user)}
                                  id="userListingStyle"
                                  onClick={() => {
                                    this.setState({ currentUser: user });
                                  }}
                                >
                                  <tr className="listRow">
                                    <td className="listCell" id="listing">
                                      {" "}
                                      {user.username}{" "}
                                    </td>
                                    <td className="listCell" id="listing">
                                      {" "}
                                      {user.role}{" "}
                                    </td>
                                    <td className="listCell" id="listingEdit">
                                      {" "}
                                      {user.role !== "admin" && (
                                        <IconButton
                                          id="deleteUserButton"
                                          onClick={() => {
                                            removeUserInfo(this, user);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      )}
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </List>
                </Paper>
              </div>
            </div>

            {/* t.author === this.state.currentUser.username.toLowerCase() */}
            {this.state.trails.filter(
              (t) =>
                t.author === this.state.currentUser.username ||
                t.users.includes(this.state.currentUser.username)
            ).length !== 0 && (
              <div id="userTrails">
                <div>
                  <table id="userListingStyle">
                    <th className="listCell">Trails Posted </th>
                  </table>
                </div>
                <div id="usersTrailsList" style={{ justifyContent: "center" }}>
                  {/*postifyjustent*/}
                  {this.state.trails
                    .filter(
                      (t) =>
                        t.author === this.state.currentUser.username ||
                        t.users.includes(this.state.currentUser.username)
                    )
                    .map((userTrails) => {
                      return (
                        <div>
                          <li key={uid(userTrails)}>
                            <div>
                              <TrailCard
                                trail={userTrails}
                                trailComponent={this}
                                appState={appState}
                                selectTrail={this.toggleModalTrail}
                              ></TrailCard>
                            </div>
                          </li>
                        </div>
                      );
                    })}
                </div>

                {this.state.selectTrail && (
                  <TrailModal
                    selectedTrail={this.state.selectTrail}
                    toggleModal={this.toggleModalTrail}
                  ></TrailModal>
                )}
              </div>
            )}
          </div>
          <div id="rightContainer">
            <div id="userHistory">
              <div id="userListingStyle">
                <div className="userListing">
                  {this.state.posts.filter(
                    (p) =>
                      p.author.toLowerCase() ===
                      this.state.currentUser.username.toLowerCase()
                  ).length !== 0 && (
                    <table>
                      <tr>
                        <th>Username </th>
                        <th> Role </th>
                        <th> Posts </th>
                        <th> Trails </th>
                      </tr>
                      <tr>
                        <td>{this.state.currentUser.username} </td>
                        <td> {this.state.currentUser.role} </td>
                        <td>
                          {" "}
                          {
                            this.state.posts.filter(
                              (x) =>
                                x.author.toLowerCase() ===
                                this.state.currentUser.username.toLowerCase()
                            ).length
                          }
                        </td>
                        <td>
                          {" "}
                          {
                            this.state.trails.filter(
                              (x) =>
                                x.author === this.state.currentUser.username
                            ).length
                          }
                        </td>
                      </tr>
                    </table>
                  )}
                </div>
              </div>

              {this.state.posts.filter(
                (p) =>
                  p.author.toLowerCase() ===
                  this.state.currentUser.username.toLowerCase()
              ).length !== 0 && (
                <div
                  id="usersPostsList"
                  style={{
                    justifyContent: this.state.postDisplay,
                    maxWidth: "600px",
                    minWidth: "500px",
                  }}
                >
                  {/* this.postsJustifyContent */}
                  {this.state.posts &&
                    this.state.posts
                      .filter(
                        (p) =>
                          p.author.toLowerCase() ===
                          this.state.currentUser.username.toLowerCase()
                      )
                      .map((userposts) => {
                        return (
                          <div>
                            <li key={uid(userposts)}>
                              <div>
                                <PostCard
                                  id="postsInAdmin"
                                  post={userposts}
                                  homeComponent={this}
                                  appState={appState}
                                  selectPost={this.toggleModal}
                                ></PostCard>
                              </div>
                            </li>
                          </div>
                        );
                      })}

                  {this.state.selectedPost && (
                    <PostModal
                      post={this.state.selectedPost}
                      toggleModal={this.toggleModal}
                    ></PostModal>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
