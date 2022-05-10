import React from "react";
import "../Modal/Modal.css";
import { uid } from "react-uid";
import { addComment, getComments } from "../../actions/home.js";
import { Link as Linker} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";



// environment configutations
import ENV from "../../config.js";
const API_HOST = ENV.api_host;

class PostModal extends React.Component {
  state = {
    comment: "",
    post: this.props.post,
    num_comments: 0,
  };

  toggleModal = this.props.toggleModal;
  

  handleInputChange = (event) => {
    const text = event.target.value;
    this.setState({
      comment: text,
    });
  };

  
  componentDidMount(){
    getComments(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // only update chart if the data has changed
    console.log("running componentDidUpdate");
    console.log(prevState.num_comments)
    console.log(this.state.num_comments)

    if (prevState.num_comments !== this.state.num_comments) {
      console.log("running getComments()")
      getComments(this);
    }

  }

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <span
            className="close"
            onClick={() => {
              this.toggleModal(null);
            }}
          >
            &times;
          </span>
          <div>
            <h3>{this.state.post.title}</h3>
          </div>
          <div className="modal-banner">
            <img src={this.state.post.picture} alt="banner" />
          </div>
          <div>
            <h3>{this.state.post.caption}</h3>
          </div>
          <div>
            <p>{this.state.post.content}</p>
          </div>
          <div className="modal-comment-input">
            <textarea
              onChange={this.handleInputChange}
              type="text"
              value={this.state.comment}
            />
            <button onClick={() => addComment(this, this.props.currentUser)} tyle="submit">
              +
            </button>
          </div>

          <div className="modal-comment-section">
            {this.state.post.comments.map((comment) => {
              return (
                <div>
                  <li className="modal-comment" key={uid(comment)}>
                    {
                      <div id="modal-comment-username">
                        <Tooltip title={"Visit " + comment.creator + "'s Profile"}>
                        <Linker to={"/profile/" + comment.creator}>
                        {comment.creator}:{" "}
                        </Linker>
                        </Tooltip>
                      </div>
                    }
                    {comment.text}
                  </li>
                </div>
              );
            })}
          </div>
        </div>
        {console.log(this.state)}
      </div>
    );
  }
}

export default PostModal;
