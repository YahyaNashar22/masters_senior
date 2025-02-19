import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

const Container = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Outlet />
      </Box>
    </>
  );
};

export default Container;
