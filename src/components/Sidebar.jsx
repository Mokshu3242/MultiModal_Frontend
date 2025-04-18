import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import PropTypes from "prop-types";
import { X, MessageCircle, Folder, MoreVertical, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";

export function Sidebar({ isOpen, toggleSidebar }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isFilePopupOpen, setIsFilePopupOpen] = useState(false);
  const [fileContentLoading, setFileContentLoading] = useState(false);
  const togglePopup = () => setIsPopupOpen((prev) => !prev);

  useEffect(() => {
    console.log("Current language:", i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (isPopupOpen) fetchDocuments();
    fetch_chats();
  }, [isPopupOpen]);

  // Persist chat ID across refreshes
  useEffect(() => {
    if (location.pathname.includes("/chat/")) {
      const storedChatId = localStorage.getItem("currentChatId");
      const pathChatId = location.pathname.split("/chat/")[1];

      if (pathChatId && pathChatId !== "default_chat") {
        localStorage.setItem("currentChatId", pathChatId);
      } else if (
        storedChatId &&
        (!pathChatId || pathChatId === "default_chat")
      ) {
        navigate(`/chat/${storedChatId}`);
      } else if (
        !storedChatId &&
        (!pathChatId || pathChatId === "default_chat")
      ) {
        localStorage.setItem("currentChatId", "default_chat");
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const storedDocument = localStorage.getItem("selectedDocument");
    if (storedDocument) {
      const doc = JSON.parse(storedDocument);
      const chatId = doc.chat_id || doc.file_name || "default_chat";
      localStorage.setItem("currentChatId", chatId);
      if (!location.pathname.includes(chatId)) {
        navigate(`/chat/${chatId}`, { state: { document: doc } });
      }
    }
  }, [navigate, location.pathname]);

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return "neutral";
    const now = new Date();
    const expiry = new Date(expiryDate);
    const hoursLeft = (expiry - now) / (1000 * 60 * 60);

    if (hoursLeft < 12) return "critical";
    if (hoursLeft < 24) return "warning";
    return "neutral";
  };

  const formatTimeRemaining = (expiryDate) => {
    if (!expiryDate) return "";
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const fetch_chats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();
      setChatHistory(data["chat_history"]);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError("Failed to fetch chat history. Please try again.");
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/fetch_all_documents`,
        {
          withCredentials: true,
        },
      );
      console.log("Fetched documents:", response.data?.documents);
      setDocuments(response.data?.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToChat = (chatId) => {
    localStorage.setItem("currentChatId", chatId);
    if (!location.pathname.includes(chatId)) {
      localStorage.removeItem("selectedDocument");
    }
    navigate(`/chat/${chatId}`);
    setTimeout(() => window.location.reload(), 200);
    if (location.pathname.includes(chatId)) {
      setTimeout(() => window.location.reload(), 200);
    }
  };

  const openFilePopup = (doc) => {
    console.log("Selected document:", doc);
    setSelectedDoc(doc);
    setIsFilePopupOpen(true);
    setFileContentLoading(true);
    setTimeout(() => setFileContentLoading(false), 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("selectedDocument");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentChatId");
    navigate("/LandingPage");
  };

  const openChatWithDoc = (doc) => {
    localStorage.setItem("selectedDocument", JSON.stringify(doc));
    const chatId = doc.chat_id || doc.file_name || "default_chat";
    localStorage.setItem("currentChatId", chatId);
    navigate(`/chat/${chatId}`, { state: { document: doc } });
    togglePopup();
    setTimeout(() => window.location.reload(), 200);
  };

  const handleNewChat = () => {
    localStorage.removeItem("selectedDocument");
    localStorage.setItem("currentChatId", "default_chat");
    navigate("/chat/default_chat");
    setTimeout(() => window.location.reload(), 200);
  };

  const handleDelete = async (fileName) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL
        }/delete_document?file_name=${fileName}`,
        { withCredentials: true },
      );

      if (response.status === 200) {
        fetchDocuments();
        togglePopup();
      } else {
        setError("Failed to delete document. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      setError(
        error.response?.data?.error ||
        "Failed to delete document. Please try again.",
      );
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/delete_chat?chat_id=${chatId}`,
        { withCredentials: true },
      );

      if (response.status === 200) {
        setChatHistory((prevChats) =>
          prevChats.filter((chat) => chat !== chatId),
        );
        if (localStorage.getItem("currentChatId") === chatId) {
          localStorage.removeItem("currentChatId");
          navigate("/chat/default_chat");
          setTimeout(() => window.location.reload(), 200);
        }
      } else {
        setError("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      setError("Failed to delete chat. Please try again.");
    }
  };

  const closeFilePopup = () => {
    setSelectedDoc(null);
    setIsFilePopupOpen(false);
    setFileContentLoading(false);
  };

  const currentChatId = location.pathname.startsWith("/chat/")
    ? location.pathname.split("/chat/")[1]
    : "default_chat";

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-72 lg:w-80 transition-transform duration-300 ease-in-out z-50 shadow-lg border-r ${isOpen ? "translate-x-0" : "-translate-x-full"
          } ${theme === "dark"
            ? "bg-gray-900 text-white border-gray-700"
            : "bg-white text-black border-gray-200"
          }`}
      >
        <div className="flex flex-col p-4 h-full">
          {/* Sidebar Header */}
          <div
            className={`flex justify-between items-center pb-4 mb-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            {/* Left side buttons */}
            <div className="flex gap-2 items-center">
              <button
                onClick={togglePopup}
                className={`p-2 rounded-md hover:bg-opacity-20 ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"
                  }`}
              >
                <Folder size={24} />
              </button>
              <button
                hidden
                className="p-2 rounded-md shadow-md transition hover:bg-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Right side button */}
            <button
              className={`p-2 rounded-md transition ${theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              onClick={toggleSidebar}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <Button
            className={`py-4 px-3 my-2 w-full text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md transition hover:scale-105 ${theme === "dark" ? "shadow-blue-900" : "shadow-blue-200"
              }`}
            onClick={handleNewChat}
          >
            {t("newChat")} <span className="ml-2 text-lg">+</span>
          </Button>

          <div
            className={`flex items-center p-3 mb-4 rounded-lg shadow-md ${theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-800"
              }`}
          >
            <MessageCircle
              className={`mr-2 w-5 h-5 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
            />
            <span className="text-sm font-semibold truncate">
              {t("currentChat")}: {currentChatId}
            </span>
          </div>
          <hr
            className={`mt-0 mb-2 ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
          />

          {/* Chat History */}
          <ScrollArea className="flex-1 custom-scrollbar">
            {chatHistory.length === 0 ? (
              <p
                className={`text-sm italic text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
              >
                {t("noHistoryAvailable")}
              </p>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="relative mt-2 w-30">
                    <div
                      className={`flex justify-between items-center p-3 h-10 rounded-lg shadow-md hover:bg-opacity-80 cursor-pointer ${theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      onClick={() => navigateToChat(chat)}
                    >
                      <span className="block text-sm font-semibold truncate max-w-[200px]">
                        {chat}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(selectedDoc === chat ? null : chat);
                        }}
                        className={`p-2 rounded-full ${theme === "dark"
                            ? "hover:bg-gray-600"
                            : "hover:bg-gray-300"
                          }`}
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    {selectedDoc === chat && (
                      <div
                        className={`absolute right-0 top-full z-50 p-2 w-32 rounded-lg shadow-lg ${theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                          } border`}
                      >
                        <button
                          onClick={() => handleDeleteChat(chat)}
                          className={`block py-2 px-3 w-full text-sm text-left rounded ${theme === "dark"
                              ? "text-red-400 hover:bg-red-700"
                              : "text-red-500 hover:bg-red-100"
                            }`}
                        >
                          {t("delete")}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Documents Popup */}
      {isPopupOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div
            className={`flex relative flex-col p-6 rounded-2xl shadow-2xl w-[600px] h-[500px] backdrop-blur-lg ${theme === "dark"
                ? "bg-gray-900 bg-opacity-90 text-gray-200"
                : "bg-white bg-opacity-90 text-gray-800"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t("storedDocuments")}</h2>
              <button
                className={`transition ${theme === "dark"
                    ? "text-gray-300 hover:text-red-400"
                    : "text-gray-700 hover:text-red-500"
                  }`}
                onClick={togglePopup}
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    {t("loadingDocuments")}
                  </p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className={`flex relative justify-between items-center p-3 w-full rounded-lg transition ${getExpiryStatus(doc.expires_at) === "critical"
                          ? theme === "dark"
                            ? "bg-red-900 hover:bg-red-800"
                            : "bg-red-100 hover:bg-red-200"
                          : getExpiryStatus(doc.expires_at) === "warning"
                            ? theme === "dark"
                              ? "bg-yellow-900 hover:bg-yellow-800"
                              : "bg-yellow-100 hover:bg-yellow-200"
                            : theme === "dark"
                              ? "bg-gray-800 hover:bg-gray-700"
                              : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      <div className="flex-grow">
                        <button
                          className="w-full text-left"
                          onClick={() => openFilePopup(doc)}
                        >
                          <div className="flex justify-between items-start">
                            {doc.expires_at && (
                              <div>
                                <p
                                  className={`text-sm font-medium ${theme === "dark"
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                    }`}
                                >
                                  {doc.file_name}
                                </p>
                                <p
                                  className={`text-xs truncate ${theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                    }`}
                                >
                                  {doc.file_path}
                                </p>

                                {/* One line for Expires label + date + remaining */}
                                <div className="flex items-center space-x-2 text-xs">
                                  <span
                                    className={`font-medium ${theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    Expires:
                                  </span>
                                  <span
                                    className={`${theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    {new Date(
                                      doc.expires_at,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span
                                    className={`font-medium ${theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    Time Remaining:
                                  </span>
                                  <span
                                    className={`${getExpiryStatus(doc.expires_at) ===
                                        "critical"
                                        ? "text-red-500"
                                        : getExpiryStatus(doc.expires_at) ===
                                          "warning"
                                          ? "text-yellow-600"
                                          : theme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                      }`}
                                  >
                                    {formatTimeRemaining(doc.expires_at)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className={`p-2 rounded-full ${theme === "dark"
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-300"
                            }`}
                        >
                          <MoreVertical size={20} />
                        </button>

                        {selectedDoc?.file_name === doc.file_name && (
                          <div
                            className={`absolute right-0 top-10 z-50 p-2 w-32 rounded-lg border shadow-lg ${theme === "dark"
                                ? "bg-gray-800 border-gray-700"
                                : "bg-white border-gray-200"
                              }`}
                          >
                            <button
                              onClick={() => openChatWithDoc(doc)}
                              className={`block py-2 px-3 w-full text-sm text-left rounded ${theme === "dark"
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              {t("openChat")}
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(selectedDoc.file_name);
                                setSelectedDoc(null);
                              }}
                              className={`block py-2 px-3 w-full text-sm text-left rounded ${theme === "dark"
                                  ? "text-red-400 hover:bg-red-700"
                                  : "text-red-500 hover:bg-red-100"
                                }`}
                            >
                              {t("delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    {t("noDocumentsFound")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Details Popup */}
      {isFilePopupOpen && selectedDoc && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div
            className={`p-6 rounded-2xl shadow-2xl w-[95%] max-w-3xl h-[85vh] overflow-hidden relative backdrop-blur-lg ${theme === "dark"
                ? "bg-gray-900 bg-opacity-90 text-gray-200"
                : "bg-white bg-opacity-90 text-gray-800"
              }`}
          >
            <button
              className={`absolute top-4 right-4 transition ${theme === "dark"
                  ? "text-gray-300 hover:text-red-400"
                  : "text-gray-700 hover:text-red-500"
                }`}
              onClick={closeFilePopup}
            >
              <X size={28} />
            </button>

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                📄 {selectedDoc.file_name}
              </h2>
            </div>

            <div
              className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
            >
              <p>Type: {selectedDoc.file_type}</p>
              <p>
                Uploaded: {new Date(selectedDoc.uploaded_at).toLocaleString()}
              </p>
              {selectedDoc.expires_at && (
                <div className="flex flex-col gap-1 text-left">
                  <div className="flex flex-wrap gap-4 items-center text-sm">
                    <span
                      className={`font-medium ${getExpiryStatus(selectedDoc.expires_at) === "critical"
                          ? "text-red-500"
                          : getExpiryStatus(selectedDoc.expires_at) ===
                            "warning"
                            ? "text-yellow-600"
                            : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                        }`}
                    >
                      Time remaining:{" "}
                      {formatTimeRemaining(selectedDoc.expires_at)}
                    </span>
                    <span
                      className={`font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      Expires:{" "}
                      {new Date(selectedDoc.expires_at).toLocaleString()}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                  >
                    (Auto-deletes after 2 days)
                  </p>
                </div>
              )}
            </div>

            <div
              className={`overflow-y-auto p-4 rounded-lg max-h-[50vh] custom-scrollbar ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
            >
              {fileContentLoading ? (
                <p
                  className={`text-sm text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {t("loadingDocumentContent")}
                </p>
              ) : (
                <pre
                  className={`whitespace-pre-wrap break-words ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  {selectedDoc.content}
                </pre>
              )}
            </div>

            <button
              className={`py-3 px-5 mt-6 w-full text-lg rounded-lg transition ${theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              onClick={closeFilePopup}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};
