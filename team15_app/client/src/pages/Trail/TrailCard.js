import * as React from "react";
import Card from "@mui/material/Card";

//import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Link from "@mui/material/Link";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { Buffer } from "buffer";
import "./TrailCard.css";
import { useHistory } from "react-router-dom";
import { Link as Linker} from "react-router-dom";



import {
  removeTrail,
  editTrail,
  getAvgTime,
  getAvgRating,
  followTrail,
  unfollowTrail,
  getUser,
} from "../../actions/trail";
import { maxHeight } from "@mui/system";

// Converting from Buffer to B64. Source: https://stackoverflow.com/questions/59430269/how-to-convert-buffer-object-to-image-in-javascript
const btoa = require("btoa");

function toBase64(arr) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

class TrailCard extends React.Component {
  state = {
    following: false,
  };

  handleTrailChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // if not following, add user to trail, set following to true
    if (this.state.following === false) {
      followTrail(this.props.trail, this.props.appState.user._id);
    } else {
      // if following, remove user from trail, set following to false

      unfollowTrail(this.props.trail, this.props.appState.user._id);
    }

    this.setState({
      [name]: !this.state.following,
    });
  };
  componentDidMount() {
    const user = getUser(this.props.appState.user._id);
    const followingTrails = user.followingTrails;
    //const title = this.props.trail.title;
    const trail_id = this.props.trail._id;
    let isFollowing = false;

    if (followingTrails.includes(trail_id)) {
      this.setState({
              following: true,
      });
    }

  }

  render() {
    const { trail, trailComponent, appState, selectTrail } = this.props;
    const newTo = { 
      pathname: "/profile/" + trail.author
    };

    var editButton = 0;
    if (appState.user.role === "admin") {
      editButton = (
        <div>
          <IconButton onClick={() => editTrail(trailComponent, trail)}>
            <EditIcon size="small">Edit</EditIcon>
          </IconButton>
        </div>
      );
    } else {
      editButton = null;
    }

    return (
      <div>
        <Card sx={{ maxWidth: 400, height: 650 }} className="trailCard">
          <CardHeader
            title={trail.title}
            subheader={
              "Posted by " + trail.author + " on " + trail.date.toLocaleString()
            }
            action={
              (appState.user._id === trail.author && (
                <IconButton onClick={() => removeTrail(trailComponent, trail)}>
                  <DeleteIcon />
                </IconButton>
              )) ||
              (appState.user.role === "admin" && (
                <IconButton onClick={() => removeTrail(trailComponent, trail)}>
                  <DeleteIcon />
                </IconButton>
              ))
            }
          />

          <div onClick={() => selectTrail(trail)}>
            <CardMedia
              component="img"
              alt="default picture"
              height="400"
              width="400"
              image={trail.picture} //{`data:image/png;base64,${base64String}`}  //{trail.picture} // {<img src={`data:image/png;base64,${base64String}`} alt=""/>}
            />
          </div>

          <CardContent>
            <Typography
              variant="body2"
              style={{ color: "text.secondary", fontWeight: "bold" }}
            >
              Rating: {getAvgRating(trail.ratings)}
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "text.secondary", fontWeight: "bold" }}
            >
              Average Time: {getAvgTime(trail.times)}
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "text.secondary", fontWeight: "bold" }}
            >
              <Link href={trail.strava}>Strava</Link>
            </Typography>
          </CardContent>

          <CardActions>
            <div onClick={() => selectTrail(trail)}>
              <Tooltip title="Info">
                <IconButton>
                  <InfoIcon size="small"></InfoIcon>
                </IconButton>
              </Tooltip>
            </div>
            <Tooltip title="Follow Trail">
              <Checkbox
                icon={<AddCircleIcon />}
                checkedIcon={<AddCircleIcon />}
                checked={this.state.following}
                onChange={this.handleTrailChange}
                name="following"
              />
            </Tooltip>
          {editButton}
          <Tooltip title="Visit the Author's Profile">
            <Linker to={newTo}>
              <IconButton>
                  <PersonIcon size="small"></PersonIcon>
                </IconButton>
            </Linker>

            </Tooltip>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default TrailCard;
