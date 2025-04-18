import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import "react-toastify/dist/ReactToastify.css";

export function NavBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveTheme = theme === "system" ? resolvedTheme : theme;

  const updateUserLanguage = async (lng) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/update-language`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: lng }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (data.success) {
        console.log("Language updated on server:", lng);
      } else {
        console.error("Failed to update language on server:", data.message);
      }
    } catch (error) {
      console.error("Error updating language on server:", error);
    }
  };

  const changeLanguage = (lng) => {
    i18n
      .changeLanguage(lng)
      .then(() => {
        setLang(lng);
        localStorage.setItem("selectedLanguage", lng);

        if (isAuthenticated) {
          updateUserLanguage(lng);
        }
      })
      .catch((error) => {
        console.error("Error changing language:", error);
      });
  };

  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    setAvatarOpen(false);
    navigate("/Landingpage");
    window.location.reload();
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    console.log("Retrieved language from localStorage:", savedLanguage);
    i18n
      .changeLanguage(savedLanguage)
      .then(() => {
        setLang(savedLanguage);
      })
      .catch((error) => {
        console.error("Error changing language:", error);
      });
  }, [i18n]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/profile`,
            {
              method: "GET",
              credentials: "include",
              cache: "force-cache",
            },
          );

          const data = await response.json();
          if (data.success) {
            setUser(data.user);

            const savedLanguage =
              data.user.language ||
              localStorage.getItem("selectedLanguage") ||
              "en";
            i18n
              .changeLanguage(savedLanguage)
              .then(() => {
                setLang(savedLanguage);
                localStorage.setItem("selectedLanguage", savedLanguage);
              })
              .catch((error) => {
                console.error("Error changing language:", error);
              });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchProfile();
    }
  }, [isAuthenticated, navigate, i18n]);

  return (
    <div className="flex justify-between items-center p-4 w-full h-16 md:h-10">
      <Link
        onClick={() => {
          localStorage.removeItem("selectedDocument");
          localStorage.setItem("currentChatId", "default_chat");
          navigate("/chat/default_chat");
          window.location.reload();
        }}
        className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-300 ease-in-out transform group-hover:opacity-90 group-hover:scale-105"
      >
        <span
          className={`text-lg font-semibold cursor-pointer animate-pulse font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transform transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-90 ${
            effectiveTheme === "dark" ? "text-white" : "text-black"
          } relative group`}
        >
          <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-300 ease-in-out transform group-hover:opacity-90 group-hover:scale-105">
            MULTIGPT
          </p>
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-10 transform scale-105 blur-md"></span>
        </span>
      </Link>
      
      <div className="flex items-center ml-auto space-x-2 md:space-x-6">
        {/* Theme Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              aria-label="Toggle theme"
              className="flex relative justify-center items-center p-2 bg-gradient-to-br rounded-full transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-offset-2 from-primary to-primary-foreground focus:ring-primary"
            >
              <Sun
                className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-500 ${
                  effectiveTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
                }`}
              />
              <Moon
                className={`absolute h-4 w-4 md:h-5 md:w-5 transition-transform duration-500 ${
                  effectiveTheme === "light" ? "rotate-90 scale-0" : "rotate-0 scale-100"
                }`}
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className={`rounded-lg shadow-xl p-2 backdrop-blur-md transition-all duration-300 ${
              effectiveTheme === "dark" ? "bg-gray-800/80 text-white" : "bg-white/80 text-gray-900"
            }`}
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                theme === "light" ? "bg-gray-200 dark:bg-gray-700" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              <Sun className="w-4 h-4" /> {t("theme.light")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-200 dark:bg-gray-700" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              <Moon className="w-4 h-4" /> {t("theme.dark")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex relative justify-center items-center p-2 bg-gradient-to-br rounded-full transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-offset-2 from-primary to-primary-foreground focus:ring-primary"
            >
              {lang.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className={`rounded-lg shadow-xl p-2 backdrop-blur-md transition-all duration-300 ${
              effectiveTheme === "dark" ? "bg-gray-800/80 text-white" : "bg-white/80 text-gray-900"
            }`}
          >
            <DropdownMenuItem
              onClick={() => {
                changeLanguage("en");
                setTimeout(() => window.location.reload(), 200);
              }}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                lang === "en" ? "bg-gray-200 dark:bg-gray-700" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              {t("language.en")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                changeLanguage("mr");
                setTimeout(() => window.location.reload(), 200);
              }}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                lang === "mr" ? "bg-gray-200 dark:bg-gray-700" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              {t("language.mr")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                changeLanguage("hi");
                setTimeout(() => window.location.reload(), 200);
              }}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                lang === "hi" ? "bg-gray-200 dark:bg-gray-700" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              {t("language.hi")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar and Profile Dropdown */}
        {isAuthenticated && user && (
          <Popover open={avatarOpen} onOpenChange={setAvatarOpen}>
            <PopoverTrigger asChild className="cursor-pointer">
              <img
                src={user.profilePic || "../assets/users.webp"}
                alt="Avatar"
                className="w-8 h-8 md:w-11 md:h-11 rounded-full border-2 md:border-4 shadow-md transition-all duration-300 hover:scale-105 border-primary"
              />
            </PopoverTrigger>

            <PopoverContent className="p-4 my-6 mx-1 mr-4 w-60 bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-xl shadow-lg shadow-2xl shadow-gray-800 shadow-gray-200 dark:shadow-gray-900">
              <div className="flex flex-col items-center text-center">
                <img
                  src={user.profilePic || "../assets/users.webp"}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-4 shadow-md transition-all duration-300 hover:scale-105 border-primary"
                />

                <span className="mt-2 text-lg font-semibold text-white text-gray-900 dark:text-black">
                  {user.name}
                </span>
                <span className="text-sm text-black dark:text-gray-800">
                  {user.email}
                </span>

                <div className="flex flex-col gap-2 mt-4 w-full">
                  <a href="/profile">
                    <Button
                      variant="outline"
                      className="py-2 px-4 w-full text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm transition-all duration-300 dark:text-white dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setAvatarOpen(false);
                        navigate("/profile");
                      }}
                    >
                      View Profile
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    className="py-2 px-4 w-full text-sm font-medium text-white bg-red-500 rounded-lg shadow-md transition-all duration-300 hover:bg-red-600"
                    onClick={handleLogout}
                  >
                    {t("logout")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}