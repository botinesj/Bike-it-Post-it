import AdminDashboard from "../pages/Admin/AdminDashboard";
// ================== ENV CONFIGURATIONS ================== //

import ENV from "./../config";
const API_HOST = ENV.api_host;
console.log("Current environment:", ENV.env);

const log = console.log;

// ================== API FUNCTIONS ================== //

// GET request to get all trails
export const getTrails = (trail) => {
  // the URL for the request
  const url = `${API_HOST}/api/trails`;
  console.log("making a GET request: ", url);

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get trails");
      }
    })
    .then((json) => {
     
      trail.setState({ trails: json.trails, num_trails: json.trails.length }); // json.trails
      // }
    })
    .catch((error) => {
      console.log(error);
    });
};

// POST request will be made here to add new Trails
export const addTrail = (trail, user) => { // TODO: change username when User schema done. 

  // Input error handling
  log("adding trail on: " + new Date().toLocaleString());

  const state = trail.state;
  const trailList = state.trails;
  const n = state.num_trails;

    if (state.trailTitle === "" || state.trailTime === "" || state.trailRating === "" || state.trailPicture === null) { // failure

        console.log("Input failure")
        trail.setState({
            postFail: true
        });

    } else {

        // If all inputs are good, proceed with making the POST

        // the URL for the request
        const url = `${API_HOST}/api/trails`;

        // Create our request constructor with all the parameters we need
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify({
                "title": trail.state.trailTitle,
                "picture": trail.state.trailPicture,
                "author": user.username, 
                "strava": trail.state.stravaLink,
                "users": [user._id],
                "times": [trail.state.trailTime],
                "ratings": [trail.state.trailRating],
                // "comments": [],
                "date": (new Date()).toLocaleString()
            }),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });

        // Send the request with fetch()
        fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            if (res.status === 200) {
                // If trail was added successfully, tell the user.
                console.log("added trail!")
                trail.setState({
                    num_trails: trailList.length + 1,
                    trails: trailList,
                    trailModalOpen: false,
                    stravaLink: "",
                    // postAlert: true,
                    trailTitle: "",
                    trailTime: "",
                    trailRating: "",
                    trailPicture: null,
                    trailPostSuccess: true
                });
            } else {
                // If server couldn't add the trail, tell the user.
                trail.setState({
                    postFail: true
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
        
    }

}


export const removeTrail = (trailComponent, trail) => {
  // DELETE call to remove trails.

  // the URL for the request
  const url = `${API_HOST}/api/trails/${trail._id}`;
  const trailList = trailComponent.state.trails;

  log("url: ", url);
  const request = new Request(url, {
    method: "DELETE",
  });

  // Send the request with fetch()
  fetch(request)
    .then(function (res) {
      // Handle response we get from the API.
      if (res.status === 200) {
        // If trail was removed successfully, tell the user.
        console.log("Removed trail!");
        trailComponent.setState({
          num_trails: trailList.length - 1,
        });
      } else {
        // If server couldn't remove the trail, tell the user.
        alert("An error has occured. Unable to remove trail.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editTrailSubmission = (home) => {
  // PATCH request will be made here to edit trail details

  if (
    home.state.trailTitle === "" ||
    home.state.trailTime === "" ||
    home.state.trailRating === "" ||
    home.state.stravaLink === ""
  ) {
    // failure

    home.setState({
      editFail: true,
    });
  } else {
    const trails = home.state.trails;
    const trailToEdit = trails.filter((t) => {
      return t == home.state.trailToEdit;
    });

    // the URL for the request
    const url = `${API_HOST}/api/trails/edit/${trailToEdit[0]._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify({
        title: home.state.trailTitle,
        times: home.state.trailTime,
        ratings: home.state.trailRating,
        strava: home.state.stravaLink,
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
          // If trail was edited successfully, tell the user.
          console.log("Edited trail!");
          home.setState({
            // trails: trails,
            editTrailModalOpen: false,
            editSuccess: true,
          });
        } else {
          // If server couldn't remove the trail, tell the user.
          alert("An error has occured. Unable to edit trail.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const addUserToTrail = (trailComponent, username, existingTrail) => {
  // Users are "added" to a trail if they have a time for that trail. This happens when
  // a user tries adding an *existing* trail, they are prompted to add their time and rating to the existing trail,
  // instead of creating a duplicate trail post.

  // POST request will be made here to add user to trail.
  const trailList = trailComponent.state.trails;

  // the URL for the request
  const url = `${API_HOST}/api/trails/${existingTrail._id}/adduser`;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      times: trailComponent.state.trailTime,
      ratings: trailComponent.state.trailRating,
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  // Send the request with fetch()
  fetch(request)
    .then(function (res) {
      // Handle response we get from the API.
      if (res.status === 200) {
        // If trail was edited successfully, tell the user.
        console.log("Added records to the trail!");
        trailComponent.setState({
          trails: trailList,
          trailModalOpen: false,
          stravaLink: "",
          // postAlert: true,
          trailTitle: "",
          trailTime: "",
          trailRating: "",
          trailPicture: null,
          trailPostSuccess: true,
        });
      } else {
        // If server couldn't remove the trail, tell the user.
        alert("An error has occured. Unable to edit trail.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const followTrail = (trail, uid) => { //user
    // TODO: PATCH request will be made here to add user to trail's user list
    // This needs to be done when the User Schema is defined

    // the URL for the request
    const url = `${API_HOST}/api/users/follow/${trail._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify({
            "user_id": uid 
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        if (res.status === 200) {
            // If trail was edited successfully, tell the user.
            console.log("User is now following the trail!")
        } else {
            // If server couldn't remove the trail, tell the user.
            alert("An error has occured. Unable to follow trail.")
        }
    })
    .catch(error => {
        console.log(error);
    });

}

export const unfollowTrail = (trail, uid) => { 
    // DELETE request will be made here to remove user from trail's user list

    // the URL for the request
    const url = `${API_HOST}/api/users/unfollow/${trail._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "DELETE",
      body: JSON.stringify({
          "user_id": uid 
      }),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });

    // Send the request with fetch()
    fetch(request)
    .then(function (res) {
        // Handle response we get from the API.
        if (res.status === 200) {
            // If trail was unfollowed successfully, tell the user.
            console.log("User has unfollowed the trail!")
        } else {
            // If server couldn't remove the trail, tell the user.
            alert("An error has occured. Unable to unfollow trail.")
        }
    })
    .catch(error => {
        console.log(error);
    });
}

export const getUser = (username) => {
  // SOURCE: https://stackoverflow.com/questions/37586085/store-json-data-into-a-variable-using-javascript
  
  // the URL for the request
  const url = `${API_HOST}/api/users/${username}`; 

  var http_req = new XMLHttpRequest();
  http_req.open("GET",url,false);
  http_req.send(null);

  return JSON.parse(http_req.responseText);  
}

// ================== HELPER FUNCTIONS ================== //

export const editTrail = (home, trail) => {
  // responsible for opening "Edit Trail" modal.

  const trailToEdit = home.state.trails.filter((t) => {
    return t == trail;
  });

  home.setState({
    editTrailModalOpen: true,
    trailTitle: trailToEdit[0].title,
    trailTime: trailToEdit[0].times[0],
    trailRating: trailToEdit[0].ratings[0],
    stravaLink: trailToEdit[0].strava,
    trailToEdit: trail,
  });
};

export const sortFilter = (trails, state) => {

  // Help from: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/

  if (state.sortFilter === "date") {
      return trails.sort((a, b) => (Date.parse(a.date) < Date.parse(b.date)) ? 1 : -1)

  } else if (state.sortFilter === "rating") {
      return trails.sort((a, b) => (getAvgRating(a.ratings) < getAvgRating(b.ratings)) ? 1 : -1)

  } else if (state.sortFilter === "time") {
      return trails.sort((a, b) => (getAvgTime(a.times) < getAvgTime(b.times)) ? 1 : -1)

  } else if (state.sortFilter === "name") {
      return trails.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1)

  }
}

export const getAvgTime = (times) => {
  let totalTime = 0;
  let len = times.length;
  times.forEach((time) => {
    let arr = time.split(":");
    totalTime += parseInt(arr[0]) * 60 * 60;
    totalTime += parseInt(arr[1]) * 60;
    totalTime += parseInt(arr[2]);
  });

  let avgTime = Math.round(totalTime / len);

  let h = Math.floor(avgTime / 3600);
  let m = Math.floor((avgTime % 3600) / 60);
  let s = Math.floor((avgTime % 3600) % 60);

  let hDisplay = h > 0 ? "" + h : "00";
  let mDisplay = m > 0 ? (m < 10 ? "0" + m : "" + m) : "00";
  let sDisplay = s > 0 ? (s < 10 ? "0" + s : "" + s) : "00";

  return `${hDisplay}:${mDisplay}:${sDisplay}`;
};

export const getAvgRating = (ratings) => {
  const sum = ratings.reduce((a, b) => a + b, 0);
  return sum / ratings.length;
};

export const suggestTrail = (query, trails) => {
  if (query == "") {
    return null;
  }
  const result = trails.filter((t) => t.title.toLowerCase().includes(query));
  return result != [] ? result[0] : null;
};

export const findTrail = (name, trails) => {
  const result = trails.filter(
    (t) => t.title.toLowerCase() == name.toLowerCase()
  );
  return result != [] ? result[0] : null;
};
