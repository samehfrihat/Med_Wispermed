import * as React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Box from "@mui/material/Box";
import ProfileButton from "../ProfileButton";
import useAuth from "../../hooks/useAuth";
import SearchForm from "../SearchForm";
import Stack from "@mui/material/Stack";
import Logo from "../Logo";
import ExpandedSearchFilters from "../ExpandedSearchFilters";
import { useSearch } from "../../contexts/SearchProvider";

const Layout = ({ children,tabs, search = true, logo = true, filter = false, allEntities }) => {
  const { isAuthorized } = useAuth();
  const history = useHistory();

  const currentPathname = window.location.pathname;

  // access check
  if (!isAuthorized) {
    history.push({ pathname: "/login" });
    // history.push({ pathname: "/studycase/login" });
  }

  const searchForm = useSearch();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 1,
          borderBottom: "1px solid #ebebeb",
          alignItems: "flex-start",
        }}
        component="header"
      >
        <Stack direction="row" spacing={1}>
          {logo && (
            <Link to={ '/'}>
              <Logo width="50px" height="50px" m />
            </Link>
          )}

          {search && currentPathname === "/result" && (
            <>
              <Box>
                <SearchForm
                  filters
                  size="medium"
                  hasCategory={true}
                  {...searchForm}
                />

                <ExpandedSearchFilters search={searchForm} tabs={tabs} allEntities={allEntities} />
                
              </Box>
            </>
          )}
          {search && !filter && currentPathname === "/pubmed/result" && (
            <SearchForm size="small" hasCategory={false} {...searchForm} />
          )}
        </Stack>

        <Stack direction={"row"} spacing={1}>
          <div style={{margin: 'auto'}} id="header-nav-placeholder" />
          <ProfileButton />
        </Stack>
      </Box>

      <main>{children}</main>
    </>
  );
};

export default Layout;
