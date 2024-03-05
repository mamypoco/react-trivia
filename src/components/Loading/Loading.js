import React from "react";
import "./loading.scss";
import ReactLoading from "react-loading";

const Loading = () => {
  //   return <div className="loading-wrapper">Loading. . .</div>;
  return (
    <ReactLoading
      className="loading-wrapper"
      type={"spokes"}
      color={"gray"}
      height={70}
      width={70}
    />
  );
};

export default Loading;
