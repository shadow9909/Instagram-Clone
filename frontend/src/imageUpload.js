import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "./imageUpload.css";
import axios from "axios";

const BASE_URL = "http://localhost:8000/";

function ImageUpload({ authToken, authTokenType, userId }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e?.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    const requestOptions = {
      method: "POST",
      headers: { Authorization: authTokenType + " " + authToken },
      body: formData,
    };

    fetch(BASE_URL + "post/images", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        createPost(data.filename);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setCaption("");
        setImage(null);
        document.getElementById("fileInput").value = null;
      });
  };

  const createPost = (imageUrl) => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: authTokenType + " " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption: caption,
        creator_id: userId,
        image_url: imageUrl,
        image_url_type: "relative",
      }),
    };

    fetch(BASE_URL + "post", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        window.location.reload();
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="imageupload">
      <input
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input
        type="file"
        placeholder="Upload a file"
        id="fileInput"
        onChange={handleChange}
      />
      <Button className="imageupload_button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
