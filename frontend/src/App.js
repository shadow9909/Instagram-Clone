import "./App.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, makeStyles, Input } from "@material-ui/core";

import Post from "./Post";
import ImageUpload from "./imageUpload";
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

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setAuthToken(window.localStorage.getItem("authToken"));
    setAuthTokenType(window.localStorage.getItem("authTokenType"));
    setUsername(window.localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    authToken
      ? window.localStorage.setItem("authToken", authToken)
      : window.localStorage.removeItem("authToken");

    authTokenType
      ? window.localStorage.setItem("authTokenType", authTokenType)
      : window.localStorage.removeItem("authTokenType");

    username
      ? window.localStorage.setItem("username", username)
      : window.localStorage.removeItem("username");
  }, [authToken, authTokenType]);

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

  const signIn = (event) => {
    if (event) event.preventDefault();
    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch(BASE_URL + "login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUsername(data.username);
        setUserId(data.user_id);
      })
      .catch((error) => {
        console.log(error);
      });
    setOpenSignIn(false);
  };

  const signUp = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    };

    fetch(BASE_URL + "user", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        signIn();
      })
      .catch((error) => {
        console.log(error);
      });
    setOpenSignUp(false);
  };

  const signOut = (event) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUsername("");
  };

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

      <Modal
        open={openSignUp}
        onClose={() => {
          setOpenSignUp(false);
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
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signUp}>
                SignUp
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
            {authToken ? (
              <Button onClick={() => signOut()}>LogOut</Button>
            ) : (
              <div>
                <Button onClick={() => setOpenSignIn(true)}>LogIn</Button>
                <Button onClick={() => setOpenSignUp(true)}>SignUp</Button>
              </div>
            )}
          </div>
        </div>
        {posts.map((post) => (
          <Post
            post={post}
            authToken={authToken}
            authTokenType={authTokenType}
            userId={userId}
            username={username}
            key={post.id}
          />
        ))}
      </div>
      {authToken ? (
        <div>
          <ImageUpload
            authToken={authToken}
            authTokenType={authTokenType}
            userId={userId}
          ></ImageUpload>
        </div>
      ) : (
        <h3>Login to Upload</h3>
      )}
    </div>
  );
}

export default App;
