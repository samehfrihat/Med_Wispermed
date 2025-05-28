import { Box } from "@mui/system";
import React from "react";

const Image = ({ width, height, src, ...rest }) => {
  return <Box component="img" {...rest} width={width} height={height} src={src} />;
};

export default React.forwardRef(Image);
