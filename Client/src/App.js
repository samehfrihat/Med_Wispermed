import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import Login from "./app/login";
import Signup from "./app/signup";
import Search from "./app/search";
import SearchResult from "./app/searchResult";
import Layout from "./components/Layout";
import GuestForm from "./app/guest";
import Settings from "./app/settings";
import SettingsProvider from "./contexts/SettingsProvider";
import SearchIndex from "./app/SearchIndex";
import SearchPubmed from "./app/searchPubmed";
import DemographicForm from "./app/DemographicForm";
import TaskDescription from "./app/TaskDescription";
import WelcomePage from "./app/WelcomePage";
import TaskPage from "./app/TaskPage";
import DonePage from "./app/done";
import TaskBanner from "./components/TaskBanner";
import FeedbackPage from "./components/Feedback";
import SearchProvider from "./contexts/SearchProvider";
import { SelectedTaskProvider } from "./contexts/SelectedTaskProvider";
function App() {
  return (
    <Router>
      <SearchProvider>
        <SelectedTaskProvider>
          <SettingsProvider>
            <Switch>
              <Route path="/" exact>
                <Layout search={false} logo={true} filter={false}>
                  <Search.screen />
                </Layout>
              </Route>

              <Route path="/search/concepts" exact>
                <Layout search={false} logo={false} filter={true}>
                  <SearchIndex.screen />
                </Layout>
              </Route>

              <Route path="/search/pubmed" exact>
                <Layout search={false} logo={false} filter={false}>
                  <SearchPubmed.screen />
                </Layout>
              </Route>

              <Route path="/studycase/login" exact>
                <DemographicForm.screen />
              </Route>

              <Route path="/studycase/description" exact>
                <TaskDescription.screen />
              </Route>

              <Route path="/studycase/task" exact>
                <Layout search={false} logo={true} filter={false}>
                  <TaskPage.screen />
                </Layout>
              </Route>

              <Route path="/studycase/done" exact>
                <Layout search={false} logo={true} filter={false}>
                  <DonePage.screen />
                </Layout>
              </Route>

              <Route path="/login" exact>
                <Login.screen />
              </Route>

              <Route path="/signup" exact>
                <Signup.screen />
              </Route>

              <Route path="/result" exact>
                {/* <Layout> */}

                <SearchResult.screen />
                {/* </Layout> */}
              </Route>

              <Route path="/pubmed/result" exact>
                {/* <Layout> */}
                <SearchResult.screen />
                {/* </Layout> */}
              </Route>

              <Route path="/guest" exact>
                <GuestForm.screen />
              </Route>

              <Route path="/settings" exact>
                <Settings.screen />
              </Route>

              <Route path="/studycase/welcome" exact>
                <WelcomePage.screen />
              </Route>

              <Route path="/studycase/feedback" exact>
                <Layout search={false} logo={true} filter={false}>
                  <FeedbackPage />
                </Layout>
              </Route>

              <Route path="/studycase/description" exact>
                <Layout search={false} logo={true} filter={false}>
                  <TaskDescription.screen />
                </Layout>
              </Route>
            </Switch>
            <Route
              path={["/search/pubmed", "/pubmed/result", "/", "/result"]}
              exact
            >
              <TaskBanner />
            </Route>
          </SettingsProvider>
        </SelectedTaskProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;
