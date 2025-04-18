import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import ChatPage from "./components/ChatPage";
import { ThemeProvider } from "./components/ThemeProvider";
import { NavBar } from "./components/navbar";
import { Button } from "./components/ui/button";
import { Menu } from "lucide-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import { isTokenExpired } from "./utils/auth";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <MainLayout />
      </Router>
    </ThemeProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true",
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Check authentication state on route changes
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";

    if (!authStatus) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
    } else if (authStatus) {
      setIsAuthenticated(true);
    }
  }, [location.pathname, isAuthenticated]);

  // Handle auth pages separately
  if (location.pathname === "/login" || location.pathname === "/register") {
    if (isAuthenticated) {
      return <Navigate to="/chat/default_chat" replace />;
    }
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gradient-to-r from-blue-600 to-purple-600">
        {location.pathname === "/login" ? (
          <Login setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <Register setIsAuthenticated={setIsAuthenticated} />
        )}
      </div>
    );
  }

  // Handle authenticated routes
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className={`flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen
              ? "ml-72 lg:ml-80 w-[calc(100%-18rem)] lg:w-[calc(100%-20rem)]"
              : "w-full"
            }`}
        >
          <div className="flex sticky top-0 z-10 justify-between items-center p-4 bg-white border-b dark:bg-black">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="z-40"
            >
              <Menu className="w-6 h-6 text-black dark:text-white" />
            </Button>
            <NavBar />
          </div>

          <Routes>
            <Route
              path="/"
              element={<Navigate to="/chat/default_chat" replace />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route
              path="*"
              element={<Navigate to="/chat/default_chat" replace />}
            />
          </Routes>
        </div>
      </div>
    );
  }

  // Handle non-authenticated routes
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Landingpage" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
