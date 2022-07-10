import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Explore from "./components/Explore";
import Inbox from "./components/Inbox/Inbox";
import Messages from "./components/Inbox/Messages";
import PostView from "./components/Post/PostView";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Navbar */}
          <Route path="/Minstagram/" element={< Navbar />}>
            <Route index element={<Home />} />
            <Route path="/Minstagram/post" >
              <Route path=":id" element={<PostView/>} />
            </Route>
            <Route path="/Minstagram/inbox" element={<Inbox />}>
              <Route path=":user" element={<Messages />} />
            </Route>
            <Route path="/Minstagram/explore" element={<Explore />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;