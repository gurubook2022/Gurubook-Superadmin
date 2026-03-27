"use client";
import axios from "axios";

const Button = () => {
  const handleClick = async () => {
    const BODY = "Hi there";

    const config = {
      method: "post",
      url: `https://api.narakeet.com/text-to-speech/mp3`,
      headers: {
        "Content-Type": "text/plain",
        "x-api-key": `o3iaSf1efl2pZ7owZCFfb3V6gBn9IsKN4okyD0s7`,
      },
      data: BODY,
    };
    const response = await axios(config);
    const statusUrl = response.data.statusUrl;

  };
  return (
    <button
      onClick={() => {
        handleClick();
      }}
    >
    </button>
  );
};

export default Button;
