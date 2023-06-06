import { useState, useEffect } from "react";
import Dropdown from "./components/Dropdown";
import "./App.css";

const _url = "https://jsonplaceholder.typicode.com/users";

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(_url)
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  return (
    <div className="App">
      <Dropdown
        placeHolder="Select your name..."
        users={users}
        isMulti
        isSearchable
        onChange={(value) => console.log(value)}
      />
    </div>
  );
};

export default App;
