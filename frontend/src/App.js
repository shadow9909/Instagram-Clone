import "./App.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, makeStyles, Input } from "@material-ui/core";

import Post from "./Post";
import { mergeClasses } from "@material-ui/styles";

const BASE_URL = "http://localhost:8000/";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    width: 400,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const signIn = (event) => {};

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);

  useEffect(() => {
    fetch(BASE_URL + "post/all")
      .then((response) => {
        const json = response.json();
        if (response.ok) {
          return json;
        } else throw response;
      })
      .then((data) => {
        const result = data.sort((a, b) => {
          return a.timestamp < b.timestamp;
        });
        return result;
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }, []);

  return (
    <div className="app">
      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                src="https://images.news18.com/ibnlive/uploads/2021/08/instagram-logo-16299676593x2.jpg?impolicy=website&width=510&height=356"
                alt="Instagram"
                className="app_headerImage"
              />
              <br />
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Input>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signIn}>
                Login
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app_posts">
        <div className="app_header">
          <img
            src="https://images.news18.com/ibnlive/uploads/2021/08/instagram-logo-16299676593x2.jpg?impolicy=website&width=510&height=356"
            alt="Instagram"
            className="app_headerImage"
          />

          <div>
            <Button onClick={() => setOpenSignIn(true)}>LogIn</Button>
            <Button onClick={() => setOpenSignUp(true)}>SignUp</Button>
          </div>
        </div>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
