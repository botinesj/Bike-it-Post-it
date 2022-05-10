// ================== ENV CONFIGURATIONS ================== //

import AdminDashboard from "../pages/Admin/AdminDashboard";
import ENV from "./../config";
const API_HOST = ENV.api_host;
console.log("Current environment:", ENV.env);

const log = console.log;
// ================== API FUNCTIONS ================== //

export const registerUser = (registerComp) => {
  const request = new Request(`${API_HOST}/api/register`, {
    method: "post",
    body:  JSON.stringify(registerComp.state),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });


  fetch(request)
  .then(res => {
    if(res.status == 200) {
      registerComp.setState({isRegistered: true, registerAlert: true})
      registerComp.onRegistered()
      console.log(registerComp.state)
    } else if (res.status == 409) {
      registerComp.setState({isRegistered: false, isUserTaken: true})
    }
  })
  .catch(error => {
    console.log(error);
  });
}

// TODO: requsest to check if user exists or not

export const loginUser = (loginComp, app) => {
  const request = new Request(`${API_HOST}/users/login`, {
    method: "post",
    body: JSON.stringify(loginComp.state),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      if (json.currentUser !== undefined) {
        app.setState({ user: json.currentUser });
      }
    })
    .catch(error => {
      console.log(error);
    });
}

export const logout = (app) => {
  const url = `${API_HOST}/users/logout`;

  fetch(url)
      .then(res => {
          app.setState({
              user: null
          });
      })
      .catch(error => {
          console.log(error);
      });
};

export const checkSession = (app) => {
  const url = `${API_HOST}/users/check-session`;
  log('checking session')

  fetch(url)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      if (json.currentUser !== undefined) {
        app.setState({ user: json.currentUser });
      }
    })
    .catch(error => {
      console.log(error);
    });

};

export const checkUserExists = (comp, value) => {
  const url = `${API_HOST}/api/check-user-exists`;
  const username = value

  const request = new Request(url, {
    method: "post",
    body: JSON.stringify({username: username}),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  fetch(request)
    .then(res => {
      if (res.status === 200) {
        comp.setState({isUserTaken: true})
      } else if (res.status === 404) {
        comp.setState({isUserTaken: false})
      }
      comp.setState({username: value})
    })
    .catch(error => {
      console.log(error);
    });
  
}

// A function to send a GET request to the web server
export const getUsers = (admin) => {
  // the URL for the request
  const url = `${API_HOST}/api/users`;
  console.log(url);

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        // log(res.json())
        return res.json();
      } else {
        alert("Could not get users");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body
      admin.setState({
        users: json.users,
        user_number: json.users.length,
        usersSelected: json.users,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to the web server
export const getUser = (home, profileUsername) => {
  // the URL for the request
  const url = `${API_HOST}/api/users`;
  console.log(url);


  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        // log(res.json())
        return res.json();
      } else {
        alert("Could not get users");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body
      const desiredUser = json.users.filter((u) => {
        return u.username === profileUsername;
      });
      home.setState({ 
        followingTrails: desiredUser[0].followingTrails, 
        userUserName: desiredUser[0].username,
        profileUser: desiredUser[0],
        userName: desiredUser[0].name,
        userGender: desiredUser[0].gender,
        userLocation: desiredUser[0].location,
        userDescription: desiredUser[0].description,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Function to add a student, needs to be exported
export const removeUser = (AdminDashboard, user) => {
  // const updateduserList = Data.data.users

  const updateduserList = AdminDashboard.state.users.filter((u) => {
    return u !== user;
  });

  AdminDashboard.setState({
    users: updateduserList,
    usersSelected: updateduserList,
  });
};

export const editUser = (home, user) => {
  const userToEdit = home.state.users.filter((u) => {
    return u == user;
  });

  home.setState({
    editModalOpen: true,
    userName: userToEdit[0].name,
    userDescription: userToEdit[0].description,
    userGender: userToEdit[0].gender,
    userLocation: userToEdit[0].location,
    userToEdit: user,
  });
};

export const editUserSubmission = (home) => {
  if (
    home.state.userName === "" ||
    home.state.userLocation === "" ||
    home.state.userDescription === ""
  ) {
    // failure

    home.setState({
      editFail: true,
    });
  } else {
    const user = home.state.profileUser;

    // the URL for the request
    const url = `${API_HOST}/api/users/edit/${user._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify({
            "name": home.state.userName,
            "gender": home.state.userGender,
            "location": home.state.userLocation,
            "description": home.state.userDescription,
            "picture": home.state.profileUser.picture
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    console.log(request);
    // Send the request with fetch()
    fetch(request)
      .then(function (res) {
        // Handle response we get from the API.
        if (res.status === 200) {
          // If post was edited successfully, tell the user.
          console.log("Edited user!");
          home.setState({
            editModalOpen: false,
            editSuccess: true,
          });
        } else {
          // If server couldn't remove the post, tell the user.
          alert("An error has occured. Unable to edit post.");
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

};

export const editProfilePicSubmission = (home) => {
  if (home.state.profilePicture == null) {
    home.setState({
      editFail: true,
    });
  } else {

    const user = home.state.profileUser;

    // the URL for the request
    const url = `${API_HOST}/api/users/edit/${user._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify({
        name: home.state.userName,
        gender: home.state.userGender,
        location: home.state.userLocation,
        description: home.state.userDescription,
        picture: home.state.profilePicture,
      }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });
    console.log(request);
    // Send the request with fetch()
    fetch(request)
      .then(function (res) {
        // Handle response we get from the API.
        if (res.status === 200) {
            // If post was edited successfully, tell the user.
            console.log("Edited user!")
            home.setState({
              editProfilePicModalOpen: false,
              editSuccess: true,
              profileUser: user,
              profilePicture: null,
            });
        } else {
          // If server couldn't remove the post, tell the user.
          alert("An error has occured. Unable to edit post.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
