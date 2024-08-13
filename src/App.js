import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

import Connect from "./pages/connect/Connect";
import Manage from "./pages/manage/Manage";
import BasicConfig from "./pages/register/BasicConfig";
import NotFond from "./pages/404/NotFond";
import Terms from "./pages/terms/Terms";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import Claim from "./pages/claim/Claim";
import Discover from "./pages/discover/Discover";
import FaQ from "./pages/faqs/FaQ";
import { useAuth } from "./hooks/useAuth";

import Loader from "./assets/Gif/8080laoder.gif";
import closeIcon from "./assets/images/toastClose.png";
import bg from "./assets/images/claimBg.webp";

// Route configurations
const AllRoutes = [
  {
    path: "/",
    Component: Connect,
    isPrivate: false,
  },
  {
    path: "/launch",
    Component: BasicConfig,
    isPrivate: true,
  },
  {
    path: "/manage",
    Component: Manage,
    isPrivate: true,
  },
  {
    path: "/leaderboard",
    Component: Leaderboard,
    isPrivate: false,
  },
  {
    path: "/claim",
    Component: Claim,
    isPrivate: false,
  },
  {
    path: "/discover",
    Component: Discover,
    isPrivate: false,
  },
  {
    path: "/tac",
    Component: Terms,
    isPrivate: false,
  },
  {
    path: "/faqs",
    Component: FaQ,
    isPrivate: false,
  },
  {
    path: "*",
    Component: NotFond,
    isPrivate: false,
  },
];

// Container component for handling authentication
const AuthContainer = ({ children, isPrivate }) => {
  const navigate = useNavigate();
  const { address, status, isConnected } = useAccount();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }

  useEffect(() => {
    // Check authentication and navigate if necessary
    if ((!isConnected || !user || !token) && isPrivate) {
      navigate("/");
    }
    setIsLoading(false);
  }, [status, pathname, token, user]);

  useEffect(() => {
    // Log out if wallet address doesn't match
    if (
      address &&
      token &&
      user &&
      user.wallet_address &&
      user.wallet_address.toLowerCase() !== address.toLowerCase()
    ) {
      logout(isPrivate);
    }
  }, [address]);

  // Render component...
  return isLoading ? null : <div>{children}</div>;
};

function App() {
  const loader = useSelector(({ loader }) => loader);
  const { pathname } = useLocation();

  useEffect(() => {
    // Set body background based on pathname
    if (pathname === "/claim") document.body.style = `background-image: url(${bg})`;
    else if (pathname === "/" || pathname === "/tac" || pathname === "/faqs")
      document.body.style = "background: linear-gradient(184deg, rgba(12, 0, 55, 1) 10%, rgba(55, 0, 55, 1) 55%);";
    else
      document.body.style =
        "background: transparent linear-gradient(146deg, #631dc3 0%, #b5293f 100%) 0% 0% no-repeat padding-box;";
  }, [pathname]);

  return (
    <>
      <Routes>
        {AllRoutes.map(({ Component, path, isPrivate }, i) => (
          <Route
            exact={true}
            path={path}
            key={i}
            element={
              <AuthContainer isPrivate={isPrivate}>
                <Component />
              </AuthContainer>
            }
          />
        ))}
      </Routes>
      <ToastContainer
        position={"top-center"}
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        closeButton={<img style={{ width: "9px", height: "9px" }} src={closeIcon} />}
        transition={Slide}
      />
      {/* Custom loader element */}
      <div
        style={
          !loader
            ? {
                animation: "outAnimation 1000ms ease-out",
                animationFillMode: "forwards",
              }
            : {}
        }
      >
        <div className="custom-loader">
          <img src={Loader} alt="loading..." />
        </div>
      </div>
    </>
  );
}

export default App;
