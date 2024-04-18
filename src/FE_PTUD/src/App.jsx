import { BrowserRouter as Router } from "react-router-dom";
import MyRoutes from "./routes";
import "./styles/sider.css";

function App() {
  return (
    <Router>
      <MyRoutes />
    </Router>
  );
}

export default App;
