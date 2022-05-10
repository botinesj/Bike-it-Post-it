import "./Footer.css";
import { Logo } from "../Logo/Logo.js";

export const Footer = () => {
  const date = new Date();
  const copyRightDate = `${date.getFullYear()}`;
  return (
    <div id="footer">
      <Logo />
      <div id="footerTitlesContainer">
        <div id="footerTitles">
          <h4> Privacy Policy </h4> <h5>© {copyRightDate}. Bike it Post it</h5>
        </div>
        <div id="footerTitles">
          <h4>Terms of Use</h4> <h4>Contact</h4>
        </div>
        <div id="footerTitles">
          <h4> Cookies Policy </h4> <h4>Customer Support</h4>
        </div>
      </div>
    </div>
  );
};
