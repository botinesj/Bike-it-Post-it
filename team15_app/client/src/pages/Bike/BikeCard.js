import * as React from "react";
//import Card from '@material-ui/core/Card';
import Card from "@mui/material/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import "./BikeCard.css";
import { Link as Linker} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';



import { removeBike, editBike } from "../../actions/bike.js";

class BikeCard extends React.Component {
  render() {
    const { bike, bikeComponent, appState, selectBike } = this.props;
    const newTo = { 
      pathname: "/profile/" + bike.owner
    };

    var editButton = 0;
    if (
      appState.user.username === bike.owner ||
      appState.user.role == "admin"
    ) {
      editButton = (
        <div>
          <IconButton onClick={() => editBike(bikeComponent, bike)}>
            <EditIcon size="small">Edit</EditIcon>
          </IconButton>
        </div>
      );
    } else {
      editButton = null;
    }

    return (
      <Card sx={{ maxWidth: 400, height: 650 }} className="bikeCard">
        <CardHeader
          title={bike.model}
          subheader={
            "Posted by " + bike.owner + " on " + bike.date.toLocaleString()
          }
          action={
            (appState.user.username === bike.owner && (
              <IconButton onClick={() => removeBike(bikeComponent, bike)}>
                <DeleteIcon />
              </IconButton>
            )) ||
            (appState.user.role === "admin" && (
              <IconButton onClick={() => removeBike(bikeComponent, bike)}>
                <DeleteIcon />
              </IconButton>
            ))
          }
        />

        <div onClick={() => selectBike(bike)}>
          <CardMedia
            component="img"
            alt="default picture"
            height="400"
            width="400"
            image={bike.picture}
          />
        </div>

        <CardContent>
          <Typography variant="body2" style={{ color: "text.secondary" }}>
            {bike.description}
          </Typography>

          <Typography
            variant="body2"
            style={{ color: "text.secondary", fontWeight: "bold" }}
          >
            Purchased on: {bike.purchasedOn}
          </Typography>
        </CardContent>

        <CardActions>
          <div onClick={() => selectBike(bike)}>
            {bike.canBuy === true && (
              <div>
                <Tooltip title="Contact Seller">
                  <IconButton>
                    <ShoppingCartIcon size="small">Buy</ShoppingCartIcon>
                  </IconButton>
                </Tooltip>

                {"$" + bike.price}
              </div>
            )}
          </div>
          {editButton}
          <Tooltip title="Visit the Owner's Profile">
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

export default BikeCard;
