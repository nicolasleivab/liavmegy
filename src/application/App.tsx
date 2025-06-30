import React from "react";
import Posts from "./views/Posts";
import { Header } from "../presentation/components";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Posts />
    </>
  );
};

export default App;
