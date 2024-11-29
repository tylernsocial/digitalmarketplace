import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import {SellerHomePage} from "./pages/SellerHomePage"
import {BuyerHomePage} from "./pages/BuyerHomePage"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<HomePage/>}/>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/seller-home-page" element={<SellerHomePage />}/>
          <Route path="/buyer-home-page" element={<BuyerHomePage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
