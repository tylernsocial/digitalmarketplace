import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BuyerHomePage } from "./pages/BuyerHomePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MiddleManPage } from "./pages/MiddleManPage";
import { SellerHomePage } from "./pages/SellerHomePage";
import { SellerOrderPage } from "./pages/SellerOrderPage";
import { SignUpPage } from "./pages/SignUpPage";
import { CheckoutPage } from './pages/CheckoutPage';
import { BuyerOrderPage } from './pages/BuyerOrderPage';

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
          <Route path="seller-orders" element={<SellerOrderPage/>}/>
          <Route path="middleman-page" element={<MiddleManPage/>}/>
          <Route path="/checkout-page" element={<CheckoutPage />} />
          <Route path="/buyer-orders" element={<BuyerOrderPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
