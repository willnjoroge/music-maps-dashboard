import React from "react";

const LoginButton = () => {
  return (
    <div>
      <a href="http://localhost:5000/api/auth/login">
        <button>Login with Spotify</button>
      </a>
    </div>
  );
};

export default LoginButton;
