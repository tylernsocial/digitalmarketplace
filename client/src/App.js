import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BuyerHomePage } from "./pages/BuyerHomePage";
import { BuyerOrderPage } from './pages/BuyerOrderPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MiddleManPage } from "./pages/MiddleManPage";
import { PaymentPage } from './pages/PaymentPage';
import { SellerHomePage } from "./pages/SellerHomePage";
import { SellerOrderPage } from "./pages/SellerOrderPage";
import { SignUpPage } from "./pages/SignUpPage";

// routing all pages
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
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
