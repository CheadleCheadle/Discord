import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AddServerForm from "./components/AddServerForm";
import AddChannelModal from "./components/AddChannelModal/index.js";
function App() {
 const dispatch = useDispatch();
const sessionUser = useSelector(state => state.session.user)
 const [isLoaded, setIsLoaded] = useState(false);
 useEffect(() => {
  dispatch(authenticate()).then(() => setIsLoaded(true));
 }, [dispatch]);

 return (
  <>
   <Navigation />
   {isLoaded && (
    <Switch>
     <Route path="/servers/new">
      <AddServerForm />
     </Route>
     <Route path="/signup">
      <SignupFormPage />
     </Route>
    </Switch> 
   )}
  </>
 );
}

export default App;
