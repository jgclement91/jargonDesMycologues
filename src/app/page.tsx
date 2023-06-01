import Sidebar from "./components/sidebar";
import Content from "./components/content";

import "./page.css"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Content />
      </div>
    </div>
  )
};

export default App;
