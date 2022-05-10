import React from "react";
import "../../components/Modal/Modal.css";
import { uid } from "react-uid";
import Box from "@material-ui/core/Box";
import { getAvgTime, getAvgRating } from "../../actions/trail.js";

class TrailModal extends React.Component {
  state = {
    trail: this.props.selectedTrail,
  };

  render() {
    const { selectedTrail, toggleModal } = this.props;
    const avgTime = getAvgTime(selectedTrail.times);
    const avgRating = getAvgRating(selectedTrail.ratings);
    const contents = [];
    for (let i = 0; i < selectedTrail.users.length; i++) {
      contents.push({
        user: selectedTrail.users[i],
        time: selectedTrail.times[i],
        rating: selectedTrail.ratings[i]
      });
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <span
            className="close"
            onClick={() => {
              toggleModal(null);
            }}
          >
            &times;
          </span>
          <div>
            <h3>{selectedTrail.title}</h3>
          </div>
          <div className="modal-banner">
            <img src={selectedTrail.picture} alt="banner" />
          </div>
          <div className="postion-sticky">
            <p>
              <strong>Average time: </strong>
              {`${avgTime}`}
            </p>
            <p>
              <strong>Average rating: </strong>
              {`${avgRating}`}
            </p>
          </div>

          <div className="trail-comments">
            {contents.map((c) => {
              return (
                <Box
                  sx={{ p: 2, border: "1px solid grey", margin: "10px" }}
                  key={uid(c)}
                  className="align-left"
                >
                  <p>
                    <strong>User: </strong>
                    {c.user}
                  </p>
                  <p>
                    <strong>Time: </strong>
                    {c.time}
                  </p>
                  <p>
                    <strong>Rating: </strong>
                    {c.rating}
                  </p>
                </Box>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default TrailModal;
