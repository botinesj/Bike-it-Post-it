import React from "react";
import "../../components/Modal/Modal.css";
import bike from "../../assets/images/bike1.jpg";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class BikeModal extends React.Component {
  state = {
    showPurchaseOption: false,
    canBuy: this.props.selectedBike.canBuy,
  };

  togglePurchase = (show) => {
    this.setState({
      showPurchaseOption: show,
    });
  };

  sellBike = (bike) => {
    bike.canBuy = false;
    this.setState({
      canBuy: bike.canBuy,
      showPurchaseOption: false,
    });

    alert("Purchase sucessfull");
  };

  render() {
    const { selectedBike, toggleModal } = this.props;

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
            <p>{selectedBike.model}</p>
          </div>
          <div className="modal-banner">
            <img src={selectedBike.picture} alt="banner" />
          </div>

          <div className="modal-bike-info">
            <p>
              <strong>Description:</strong> {selectedBike.description}
            </p>
            <p>
              <strong>Contact:</strong> {selectedBike.contactNumber}
            </p>
            {this.state.canBuy && (
              <p>
                <strong>Price:</strong> {`${selectedBike.price}\$`}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default BikeModal;
