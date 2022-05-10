
import ENV from "./../config";
const API_HOST = ENV.api_host;
const log = console.log;

// GET request to get all bikes
export const getBikes = (bike) => {
  // the URL for the request
  const url = `${API_HOST}/api/bikes`;
  console.log(url);

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get bikes");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body
      bike.setState({ bikes: json.bikes, num_bikes: json.bikes.length });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addBike = (bike, username) => {
  // DB call will be made here to add new Bikes
  log("adding post on: " + new Date().toLocaleString());

  const state = bike.state;
  const bikeList = state.bikes;

  // check for empty fields
  if (
    state.bikeModel === "" ||
    state.bikeContactNumber === "" ||
    state.bikePrice === "" ||
    state.bikeDescription === "" ||
    state.bikePicture === null ||
    state.bikePurchased === ""
  ) {
    // failure
    bike.setState({
      postFail: true,
    });

    // check if date entered is valid
  } else if (new Date(state.bikePurchased).toString() === "Invalid Date") {
    bike.setState({
      postFail: true,
    });
  } else {
    // the URL for the request
    const url = `${API_HOST}/api/bikes`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "post",
      body: JSON.stringify({
        model: bike.state.bikeModel,
        picture: bike.state.bikePicture,
        owner: username,
        description: bike.state.bikeDescription,
        contactNumber: bike.state.bikeContactNumber,
        price: bike.state.bikePrice,
        purchasedOn: bike.state.bikePurchased,
        canBuy: bike.state.bikeSale,
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
          // If bike was added successfully, tell the user.
          console.log("added bike!");
          bike.setState({
            num_bikes: bikeList.length + 1,
            bikes: bikeList,
            bikeModalOpen: false,
            bikeModel: "",
            // postAlert: true,
            bikeDescription: "",
            bikeContactNumber: "",
            bikePrice: "",
            bikePurchased: "",
            bikeSale: true,
            bikePicture: null,
            bikePostSuccess: true,
          });
        } else {
          // If server couldn't add the bike, tell the user.
          bike.setState({
            postFail: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const removeBike = (bikeComponent, bike) => {
  // DB call will be made here

  // the URL for the request
  const url = `${API_HOST}/api/bikes/${bike._id}`;
  const bikeList = bikeComponent.state.bikes;

  log("url: ", url);
  const request = new Request(url, {
    method: "DELETE",
  });

  // Send the request with fetch()
  fetch(request)
    .then(function (res) {
      // Handle response we get from the API.
      if (res.status === 200) {
        // If bike was removed successfully, tell the user.
        bikeComponent.setState({
          num_bikes: bikeList.length - 1,
        });
      } else {
        // If server couldn't remove the bike, tell the user.
        alert("An error has occured. Unable to remove bike.");
      }
    })
    .catch((error) => {
      console.log(error);
    });

};

export const editBike = (home, bike) => {

  const bikeToEdit = home.state.bikes.filter((b) => {
    return b == bike;
  });
  console.log(bikeToEdit[0].canBuy);
  home.setState({
    editBikeModalOpen: true,
    bikeModel: bikeToEdit[0].model,
    bikeDescription: bikeToEdit[0].description,
    bikeContactNumber: bikeToEdit[0].contactNumber,
    bikePrice: bikeToEdit[0].price,
    bikeSale: bikeToEdit[0].canBuy,
    bikeToEdit: bike,
  });
};

export const editBikeSubmission = (home) => {

  if (
    home.state.bikeModel === "" ||
    home.state.bikeContactNumber === "" ||
    home.state.bikePrice === "" ||
    home.state.bikeDescription === ""
  ) {
    // failure

    home.setState({
      editFail: true,
    });
  } else {
    const bikes = home.state.bikes;

    const bikeToEdit = bikes.filter((b) => {
      return b == home.state.bikeToEdit;
    });

    // the URL for the request
    const url = `${API_HOST}/api/bikes/edit/${bikeToEdit[0]._id}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify({
        model: home.state.bikeModel,
        contactNumber: home.state.bikeContactNumber,
        price: home.state.bikePrice,
        description: home.state.bikeDescription,
        canBuy: home.state.bikeSale,
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
          // If bike was edited successfully, tell the user.
          console.log("Edited bike!");
          home.setState({
            editBikeModalOpen: false,
            editSuccess: true,
          });
        } else {
          // If server couldn't remove the bike, tell the user.
          alert("An error has occured. Unable to edit bike.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const sortFilter = (bikes, state) => {
  // Help from: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
  if (state.sortFilter === "price") {
    return bikes.sort((a, b) => (parseInt(a.price) < parseInt(b.price) ? 1 : -1));
  } else if (state.sortFilter === "model") {
    return bikes.sort((a, b) => (a.model.toLowerCase() > b.model.toLowerCase() ? 1 : -1));
  } else if (state.sortFilter === "date") {
    return bikes.sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? 1 : -1));

  } else if (state.sortFilter === "purchase") {
    return bikes.sort((a, b) => (Date.parse(a.purchasedOn) < Date.parse(b.purchasedOn) ? 1 : -1));
  }
};
