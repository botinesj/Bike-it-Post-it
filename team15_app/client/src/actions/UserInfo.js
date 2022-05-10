import React from "react";
import { removePost } from "./home";
import { removeTrail, unfollowTrail } from "./trail.js";
import { removeUser } from "./users";

// Function to add a student, needs to be exported
export const removeUserInfo = (AdminDashboard, user) => {
  const userPosts = AdminDashboard.state.posts.filter(
    (post) => post.author.toLowerCase() === user.username.toLowerCase()
  );

  const userTrails = AdminDashboard.state.trails.filter(
    (trails) => trails.author.toLowerCase() === user.username.toLowerCase()
  );

  const userFollowedTrails = AdminDashboard.state.trails.filter((trail) =>
    user.followingTrails.includes(trail._id)
  );

  userPosts.forEach((post) => {
    removePost(AdminDashboard, post);
  });
  userFollowedTrails.forEach((trail) => {
    unfollowTrail(trail, user._id);
  });

  userTrails.forEach((trail) => {
    removeTrail(AdminDashboard, trail);
  });

  removeUser(AdminDashboard, user._id);
};
