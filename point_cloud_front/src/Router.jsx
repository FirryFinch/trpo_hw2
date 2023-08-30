import {Routes, Route} from "react-router-dom";

import Error from "./screens/Error";
import App from "./screens/App"


function Router(){
    return(
        <Routes>
            <Route element={<App/>} path="/"/>
            <Route element={<Error/>} path="*"/>
        </Routes>
    );
}

export default Router;