import React from "react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/footer";


function App() {
  const footerItems = [
    {
      key: "playlist",
      title: "Play List",
      icon: <span></span>,
      onClick: function(key: string | number) {
        console.log(key);
      }
    },
    {
      key: "playing",
      title: "Playing",
      icon: <span></span>,
      onClick: function(key: string | number) {
        console.log(key);
      }
    },
    {
      key: "albums",
      title: "Albums",
      icon: <span></span>,
      onClick: function(key: string | number) {
        console.log(key);
      }
    }
  ]

  const [itemKey, setItemKey] = React.useState("");

  return (
    <div className="my-app" style={{ textAlign: "center" }}>
      <div className={"main"}></div>
      <div className={"footer"}>
        <Footer items={footerItems} />
      </div>
    </div>
  );
}

export default App;
