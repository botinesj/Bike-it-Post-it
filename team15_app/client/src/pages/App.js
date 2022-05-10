import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import React from "react";

// Importing the Home and other pages
import Home from "./Home/Home";
import Bike from "./Bike/Bike";
import Trail from "./Trail/Trail";
import Profile from "./Profile/Profile";
import Navigation from "../components/NavBar/Navigation";
import Login from "./Login/Login";
import AdminDashboard from "./Admin/AdminDashboard.js";
import { Footer } from "../components/Footer/Footer.js";
import { checkSession } from "../actions/users"

class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    // see if user is loggedin
    checkSession(this)
  }

  render() {

    return (
      <div className="App">

        <BrowserRouter>

          {this.state.user && <Navigation
            app={this}
          ></Navigation>}

          <Switch>

            <Route
              exact path={["/"] /* any of these URLs are accepted. */}
              render={props => (
                <div className="app">
                  {!this.state.user ? <Login {...props} app={this} />: <Home {...props} appState={this.state} />}
                </div>

              )}
            />

            <Route
              exact
              path="/home"
              render={() => <Home appState={this.state} />}
            />
            <Route
              exact
              path="/bike"
              render={() => <Bike appState={this.state} />}
            />
            <Route
              exact
              path="/trail"
              render={() => <Trail appState={this.state} />}
            />
            <Route
              exact
              path={["/profile", "/profile/:username"]}
              render={() => <Profile appState={this.state} />}
            />

            {this.state.user && (
              <Route
                exact
                path="/AdminDashboard"
                render={() => <AdminDashboard appState={this.state} />}
              />
            )}
          </Switch>
        </BrowserRouter>
        <Footer style={{ justifySelf: "flex-end" }} />
      </div>
    );
  }
}

export default App;
