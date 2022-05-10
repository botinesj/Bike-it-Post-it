import * as React from "react";
//import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import Tooltip from "@mui/material/Tooltip";
import "./PostCard.css";
import { Link as Linker} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import Card from "@mui/material/Card";

import { removePost, likePost, editPost, unlikePost } from "../../actions/home";
import { ConstructionOutlined } from "@mui/icons-material";

class PostCard extends React.Component {
  state = {
    liked: false,
    likes: this.props.likes,
    currentPost: this.props.post,
  };

  handleLike(post) {
    if (!this.state.liked) {
      this.setState({ liked: true });
      this.setState({ likes: this.state.likes + 1 });
      likePost(post);
    } else {
      this.setState({ likes: this.state.likes - 1 });
      this.setState({ liked: false });
      unlikePost(post);
    }
  }

  componentDidMount = () => {
    this.setState({ likes: this.state.currentPost.likes });
  };

  render() {
    const likebuttonColor = this.state.liked ? "red" : "grey";
    const { post, homeComponent, appState, selectPost } = this.props;
    const newTo = { 
      pathname: "/profile/" + post.author
    };

    const { currentPost } = this.state;

    var editButton = 0;
    if (
      appState.user.username === post.author ||
      appState.user.role == "admin"
    ) {
      editButton = (
        <div>
          <IconButton onClick={() => editPost(homeComponent, post)}>
            <EditIcon size="small">Edit</EditIcon>
          </IconButton>
        </div>
      );
    } else {
      editButton = null;
    }

    return (
      <Card sx={{ maxWidth: 400, height: 650 }}>
        <CardHeader
          title={currentPost.title}
          subheader={
            "Posted by " + post.author + " on " + post.date.toLocaleString()
          }
          action={
            (appState.user.username === post.author && (
              <IconButton onClick={() => removePost(homeComponent, post)}>
                <DeleteIcon />
              </IconButton>
            )) ||
            (appState.user.role === "admin" && (
              <IconButton onClick={() => removePost(homeComponent, post)}>
                <DeleteIcon />
              </IconButton>
            ))
          }
        />

        <div onClick={() => selectPost(post)}>
          <CardMedia
            component="img"
            alt="default picture"
            height="400"
            width="400"
            image={currentPost.picture}
          />
        </div>

        <CardContent>
          <Typography variant="body2" style={{ color: "text.secondary" }}>
            {currentPost.caption}
          </Typography>
        </CardContent>

        <CardActions>
          <div
            id="likeButton"
            style={{ backgroundColor: { likebuttonColor } }}
            onClick={() => this.handleLike(post)}
          >
            <Tooltip title="Like">
              <IconButton>
                <FavoriteIcon size="small">Like</FavoriteIcon>
              </IconButton>
            </Tooltip>
          </div>
          <div>{this.state.likes}</div>

          <div onClick={() => selectPost(post)}>
            <Tooltip title="Comment">
              <IconButton>
                <CommentIcon size="small">Comment</CommentIcon>
              </IconButton>
            </Tooltip>
          </div>
          <div>{currentPost.comments.length}</div>
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
    );
  }
}

export default PostCard;
