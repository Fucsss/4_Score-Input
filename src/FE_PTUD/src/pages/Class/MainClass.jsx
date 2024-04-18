import React, { useState, useEffect } from "react";
import HeaderClass from "./HeaderClass";
import StudenList from "./MainClass/StudenList";
import Transcript from "./MainClass/Transcript";
import Statistical from "./MainClass/Statistical";

const MainClass = () => {
  
  const [componentToRender, setComponentToRender] = useState(<StudenList />);

  useEffect(() => {
    const renderComponent = () => {
      const routeHash = window.location.hash.substr(1);
      switch(routeHash){
        case "StudentList":
          setComponentToRender(<StudenList />);
          break;
        case "Transcript":
          setComponentToRender(<Transcript />);
          break;
        case "Statistical":
          setComponentToRender(<Statistical />);
          break;
        default:
          setComponentToRender(<StudenList />);
      }
    }

    // Call once to handle the current hash
    renderComponent();

    // Listen for future hash changes
    window.addEventListener('hashchange', renderComponent, false);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener('hashchange', renderComponent, false);
  }, []);

  return (
    <div>
      <HeaderClass />
      {componentToRender}
    </div>
  );
};

export default MainClass;