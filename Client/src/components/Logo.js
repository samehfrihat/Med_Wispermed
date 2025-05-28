import React from "react";
import Image from "./Image";

const Logo = ({ width = 50, height = 50, ...rest }) => {
  return (
    <Image {...rest} width={width} height={height} src="/WisPerMed_Main.png" />
  );
};

export default Logo;
