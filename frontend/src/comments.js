import { Button, Input } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000/";

function Comments({ post, username, authToken, authTokenType }) {
  const [comment, setComment] = useState("");

  const postComment = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authTokenType + " " + authToken,
      },
      body: JSON.stringify({
        username: username,
        post_id: post.id,
        text: comment,
      }),
    };

    fetch(BASE_URL + "comment/" + post.id, requestOptions).then((data) => {
      setComment("");
      document.getElementById("commentid").text = null;
      window.location.reload();
    });
  };

  return (
    <>
      <Input
        type="text"
        placeholder="Enter Comment"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        id="commentid"
      ></Input>
      <Button type="submit" onClick={postComment} disabled={!comment}>
        Post
      </Button>
    </>
  );
}

export default Comments;
