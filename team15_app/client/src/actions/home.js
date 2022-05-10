// environment configutations
import ENV from "../config.js";
import AdminDashboard from "../pages/Admin/AdminDashboard";
const API_HOST = ENV.api_host;

const log = console.log;

// A function to send a GET request to the web server
export const getPosts = (home) => {
  // the URL for the request
  const url = `${API_HOST}/api/posts`;
  console.log(url);

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get posts");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body

      home.setState({
        posts: json.posts,
        num_posts: json.posts.length,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to the web server
export const getComments = (postModal) => {
  // the URL for the request
  const url = `${API_HOST}/api/posts/${postModal.state.post._id}`;
  console.log(url);

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get post");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body
      log("Setting state to: ", json);
      postModal.setState({ post: json, num_comments: json.comments.length });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Function to add a student, needs to be exported
export const addPost = (home, username) => {
  // DB call will be made here to add new Posts
  log("adding post on: " + new Date().toLocaleString());

  const state = home.state;
  const postList = state.posts;

  if (
    state.postTitle === "" ||
    state.postCaption === "" ||
    state.postContent === "" ||
    state.postPicture === null
  ) {
    // failure

    home.setState({
      postFail: true,
    });
  } else {
    // success

    // the URL for the request
    const url = `${API_HOST}/api/posts`;

    // const post = home.state;

    const request = new Request(url, {
      method: "post",
      body: JSON.stringify({
        title: home.state.postTitle,
        author: username,
        caption: home.state.postCaption,
        content: home.state.postContent,
        picture: home.state.postPicture,
        date: new Date().toLocaleString(),
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
          // If post was added successfully, tell the user.
          console.log("added post!");
          home.setState({
            posts: postList,
            modalOpen: false,
            postSuccess: true,
            postTitle: "",
            postCaption: "",
            postContent: "",
            postPicture: null,
            update: true,
            num_posts: postList.length + 1,
          });
        } else {
          // If server couldn't add the post, tell the user.
          home.setState({
            postFail: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const removePost = (postComponent, post) => {
  // the URL for the request
  const url = `${API_HOST}/api/posts/${post._id}`;
  const postList = postComponent.state.posts;

  log("url: ", url);
  const request = new Request(url, {
    method: "DELETE",
  });

  // Send the request with fetch()
  fetch(request)
    .then(function (res) {
      // Handle response we get from the API.
      if (res.status === 200) {
        // If post was removed successfully, tell the user.
        console.log("Removed post!");
        postComponent.setState({
          num_posts: postList.length - 1,
        });
      } else {
        // If server couldn't remove the post, tell the user.
        alert("An error has occured. Unable to remove post.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Function to add a student, needs to be exported
export const addComment = (postModal, username) => {
  if (postModal.state.comment !== "") {
    // this.state.post.comments.push(this.state.comment); may need?

    const url = `${API_HOST}/api/posts/${postModal.state.post._id}`;
    const request = new Request(url, {
      method: "post",
      body: JSON.stringify({
        creator: username,
        text: postModal.state.comment,
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
          // If post was added successfully, tell the user.
          console.log("added comment!");
          // need to update selected post
          // console.log(postModal.state.post.comments.length + 1)
          postModal.setState({
            post: postModal.state.post,
            comment: "",
            // num_posts: postModal.state.post.comments.length + 1
            num_comments: postModal.state.num_comments + 1
          });
        } else {
          console.log("couldnt add comment!");
          // If server couldn't add the post, tell the user.
          // home.setState({
          //   // postFail: true,
          // });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const likePost = (post) => {
  log("liking post");
  post.likes++;
};

export const unlikePost = (post) => {
  log("unliking post");
  post.likes--;
};

export const editPost = (home, post) => {
  const postToEdit = home.state.posts.filter((p) => {
    return p == post;
  });

  home.setState({
    editPostModalOpen: true,
    postTitle: postToEdit[0].title,
    postCaption: postToEdit[0].caption,
    postContent: postToEdit[0].content,
    postToEdit: post,
  });
};

export const editPostSubmission = (home) => {
  if (
    home.state.postTitle === "" ||
    home.state.postCaption === "" ||
    home.state.postContent === ""
  ) {
    // failure

    home.setState({
      editFail: true,
    });
  } else {
    const posts = home.state.posts;

    const postToEdit = posts.filter((p) => {
      return p == home.state.postToEdit;
    });

    // the URL for the request
    const url = `${API_HOST}/api/posts/edit/${postToEdit[0]._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify({
        title: home.state.postTitle,
        caption: home.state.postCaption,
        content: home.state.postContent,
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
          console.log("Edited post!");
          home.setState({
            editPostModalOpen: false,
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

export const sortFilter = (posts, state) => {
  // Help from: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/

  if (state.sortFilter === "likes") {
    return posts.sort((a, b) => (a.likes < b.likes ? 1 : -1));
  } else if (state.sortFilter === "comments") {
    return posts.sort((a, b) => (a.comments < b.comments ? 1 : -1));
  } else if (state.sortFilter === "date") {
    return posts.sort((a, b) => (Date(a.date) < Date(b.date) ? 1 : -1));
  }
};

export const profileSortFilter = (everything, state) => {
  if (state.sortFilter === "new") {
    return everything.sort(function (obj1, obj2) {
      if (Date(obj2.date) - Date(obj1.date) == 0) {
        return Date.parse(obj2.date).getMilliseconds() - Date.parse(obj1.date).getMilliseconds();
      } else {
        return Date.parse(obj2.date) - Date.parse(obj1.date);
      }
    });
  } else if (state.sortFilter === "old") {
    return everything.sort(function (obj1, obj2) {
      if (Date(obj1.date) - Date(obj2.date) == 0) {
        return Date.parse(obj1.date).getMilliseconds() - Date.parse(obj2.date).getMilliseconds();
      } else {
        return Date.parse(obj1.date) - Date.parse(obj2.date);
      }
    });
  }
};

