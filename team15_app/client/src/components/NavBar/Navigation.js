import * as React from "react";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "react-router-dom";
import {logout} from "../../actions/users.js"
import { withRouter } from 'react-router-dom';
import "./Navigation.css";

function LinkTab(props) {
  return (
    <Tab
    component="a"
    onClick={(event) => {
      event.preventDefault();
    }}
    {...props}
    />
    );
  }
  
  function handleLogout(app, props) {
    logout(app)
    props.history.push('/')
  }
  
  
  const Navigation = (props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const app = props.app
  const role = app.state.user ? app.state.user.role : null
  return (

    <Box id="navContainer" sx={{ width: "100%" }}>
      <Tabs>
        <div id="navLogo">
          <div> Bike it Post it</div>
        </div>
        <Tab label="Home" to="/home" component={Link} />
        <Tab label="Bikes" to="/bike" component={Link} />
        <Tab label="Trails" to="/trail" component={Link} />
        <Tab label="Profile" to="/profile" component={Link} />
        {role === "admin" && (
          <Tab
            key="4"
            label="Dashboard"
            to="/AdminDashboard"
            component={Link}
          />
        )}
        <Tab label="Logout" to="/" onClick = {() => handleLogout(app, props)} />
      </Tabs>
    </Box>
  );
};

export default withRouter(Navigation);
