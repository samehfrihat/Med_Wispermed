import { Box, Skeleton, Stack } from "@mui/material";

export function LoadingSkeleton() {
  return (
    <Box className="result">
      <Stack alignItems={"stretch"}>
        <Skeleton variant="text" sx={{ fontSize: "2.5rem" , width: "80%" }} />

        <Stack alignItems={"stretch"} spacing={0.6}>
          <Skeleton
            variant="caption"
            sx={{
              width: "80%",
              fontSize: ".75rem" 
            }}
          />
          <Skeleton
            variant="caption"
            sx={{
              width: "80%",
              fontSize: ".75rem" 
            }}
          />
          <Skeleton
            variant="caption"
            sx={{
              width: "75%",
              fontSize: ".75rem" 
            }}
          />

          <Box spacing={0.5} sx={{display:'flex' , direction:'row' , justifyContent:'space-between',width: "80%",paddingY:3}}>
          <Skeleton
            variant="caption"
            sx={{
              width: "15%",
              fontSize: ".3rem" 
            }}
            />
                      <Skeleton
            variant="caption"
            sx={{
              width: "15%",
              fontSize: ".3rem" 
            }}
            />
                      <Skeleton
            variant="caption"
            sx={{
              width: "15%",
              fontSize: ".3rem" 
            }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
