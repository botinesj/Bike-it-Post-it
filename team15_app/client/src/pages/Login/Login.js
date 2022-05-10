import React from "react";
import { loginUser } from "../../actions/users.js";
import "./Login.css";
import Button from "@material-ui/core/Button";
import RegisterModal from './RegisterModal';

class Login extends React.Component {

  state = {
    username: "",
    password: "",
    modalOpen: false,
  };

  updateName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  updatePwd = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleLogin(e, app) {
    e.preventDefault();
    loginUser(this, app)
  }

  handleRegister(e, app) {
    e.preventDefault();
    this.setState({modalOpen: true})
  }

  closeModal = () => {
    this.setState({modalOpen: false})
  }

  render() {

    const { app } = this.props

    return (
      <div id="container">
        <div class="Login-text">
          <h1>Bike it Post it.</h1>
          <p>
            Rent · sell · siew and share all your bikes and cycling
            <a id="contrastText">
              experiences all in one easy-to navigate platform!
            </a>
          </p>
        </div>

        <div className="Login">
          <form>
            <label>
              <p>Username</p>
              <input
                type="text"
                onChange={this.updateName}
                placeholder="username"
              />
            </label>
            <label>
              <p>Password</p>
              <input
                type="password"
                onChange={this.updatePwd}
                placeholder="password"
              />
            </label>
            <div>
              <Button
                type="submit"
                id="loginButton"
                color="primary"
                onClick={(e) => this.handleLogin(e, app)}
              >
                Sign in
              </Button>
            </div>
            <div>
              <Button
                id="registerButton"
                color="primary"
                onClick={(e) => this.handleRegister(e, app)}
              >
                Register
              </Button>
            </div>
          </form>
        </div>
        <RegisterModal app={app} modalOpen={this.state.modalOpen} closeModal={this.closeModal}></RegisterModal>
      </div>
    );
  }
}

export default Login;
