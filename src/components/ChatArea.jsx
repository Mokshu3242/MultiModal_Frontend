/* eslint-disable no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";
import chatbot from "@/assets/chatbot.webp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

export default function ChatArea({ messages = [], isLoading, isProcessing }) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [effectiveTheme, setEffectiveTheme] = useState("light"); // You might want to get this from a theme context

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          setProfileLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/profile`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          if (!response.ok) throw new Error("Failed to fetch profile");

          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setProfileLoading(false);
        }
      };

      fetchProfile();
    } else {
      setProfileLoading(false);
    }
  }, [isAuthenticated, navigate]);

  const isImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  };

  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return /youtube\.com|youtu\.be/i.test(url);
  };

  const getYoutubeEmbedUrl = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const formatMessageContent = (content) => {
    if (typeof content !== "string") return content;

    if (content.includes("ajdksadkashdahsdkaskdhaskdhk")) {
      const data = JSON.parse(content);
      content = data["question"] + "\n\n" + data["url"];
    }

    return content;
  };

  const renderLoadingSkeleton = () => (
    <div className="flex justify-start mt-2 mb-2">
      <div className="flex items-start space-x-3 max-w-[90%] sm:max-w-[80%]">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-64 h-32 rounded-lg" />
      </div>
    </div>
  );

  const renderProcessingIndicator = () => (
    <div className="flex justify-start mt-2 mb-2">
      <div className="flex items-start space-x-3 max-w-[90%] sm:max-w-[80%]">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarImage src={chatbot} alt="Bot" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <div className="p-3 bg-gray-200 rounded-lg shadow-md sm:p-4 dark:bg-gray-700">
          <div className="flex items-center space-x-2">
            <span>Processing</span>
            <div className="flex space-x-1">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex relative flex-col p-4 h-full bg-white rounded-2xl border border-gray-200 shadow-2xl transition-all duration-200 ease-out sm:p-6 dark:bg-gray-900 dark:border-gray-700">
      {/* Background text element */}
      <div className="flex absolute inset-0 z-0 justify-center items-center opacity-10 pointer-events-none dark:opacity-15">
        <span className="text-lg font-semibold font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-300 ease-in-out animate-pulse transform">
          <p className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 md:text-9xl">
            MULTIGPT
          </p>
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-10 transform scale-105 blur-md"></span>
        </span>
      </div>

      {/* Chat content */}
      <div className="overflow-y-auto relative z-10 flex-1 py-4 rounded-xl sm:py-5 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-gray-300/30 scroll-smooth dark:scrollbar-thumb-blue-700/50 dark:scrollbar-track-gray-800/30">
        <div className="my-6 mx-auto space-y-4 max-w-5xl sm:my-10 sm:space-y-6">
          {isLoading && messages.length === 0 ? (
            <>
              {renderLoadingSkeleton()}
              {renderLoadingSkeleton()}
              {renderLoadingSkeleton()}
            </>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                    } mt-2 mb-2`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[90%] sm:max-w-[80%] ${message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                      }`}
                  >
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      {message.sender === "user" ? (
                        profileLoading ? (
                          <Skeleton className="w-full h-full rounded-full" />
                        ) : (
                          <>
                            <AvatarImage
                              src={user?.profilePic || "/default-user.png"}
                              alt="User"
                            />
                            <AvatarFallback>
                              {user?.name?.[0] || "U"}
                            </AvatarFallback>
                          </>
                        )
                      ) : (
                        <>
                          <AvatarImage src={chatbot} alt="Bot" />
                          <AvatarFallback>B</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`p-3 sm:p-4 rounded-lg text-sm shadow-md transition-all duration-300 ${message.sender === "user"
                          ? "bg-blue-500 text-white dark:bg-blue-600"
                          : "bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100"
                        }`}
                    >
                      {message.isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <span>Processing</span>
                          <div className="flex space-x-1">
                            {[0, 150, 300].map((delay) => (
                              <div
                                key={delay}
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${delay}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : typeof message.content === "string" &&
                        message.content.startsWith("http") ? (
                        isYoutubeUrl(message.content) ? (
                          <span className="whitespace-pre-line">
                            {message.content}
                          </span>
                        ) : isImageUrl(message.content) ? (
                          <img
                            src={message.content}
                            alt="Uploaded"
                            className="w-32 h-auto rounded-lg shadow-md sm:w-40"
                          />
                        ) : (
                          <a
                            href={message.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {message.content}
                          </a>
                        )
                      ) : (
                        <>
                          <Markdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ node, ...props }) => (
                                <p className="mb-3 last:mb-0" {...props} />
                              ),
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="mb-3 text-2xl font-bold"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="mb-3 text-xl font-bold"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="mb-2 text-lg font-bold"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="pl-5 mb-3 list-disc"
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="pl-5 mb-3 list-decimal"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="mb-1" {...props} />
                              ),
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto">
                                  <table
                                    className="mb-3 min-w-full border border-gray-300"
                                    {...props}
                                  />
                                </div>
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  className="py-1 px-3 bg-gray-100 border border-gray-300 dark:bg-gray-600"
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td
                                  className="py-1 px-3 border border-gray-300"
                                  {...props}
                                />
                              ),
                              code: ({ node, ...props }) => (
                                <code
                                  className="py-0.5 px-1 text-sm bg-gray-100 rounded dark:bg-gray-700"
                                  {...props}
                                />
                              ),
                              pre: ({ node, ...props }) => (
                                <pre
                                  className="overflow-x-auto p-3 mb-3 text-sm bg-gray-100 rounded-md dark:bg-gray-800"
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="pl-3 mb-3 italic text-gray-600 border-l-4 border-gray-400 dark:text-gray-300"
                                  {...props}
                                />
                              ),
                              a: ({ node, ...props }) => (
                                <a
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {formatMessageContent(message.content)}
                          </Markdown>
                          {message.img && (
                            <div className="mt-3">
                              <img
                                src={`data:image/png;base64,${message.img}`}
                                alt="Visualization"
                                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing &&
                !messages.some((msg) => msg.isProcessing) &&
                renderProcessingIndicator()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ChatArea.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      sender: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
        .isRequired,
      img: PropTypes.string,
      isProcessing: PropTypes.bool,
    }),
  ),
  isLoading: PropTypes.bool,
  isProcessing: PropTypes.bool,
};

ChatArea.defaultProps = {
  messages: [],
  isLoading: false,
  isProcessing: false,
};
