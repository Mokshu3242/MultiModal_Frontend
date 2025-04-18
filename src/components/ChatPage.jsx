import { useState, useEffect } from "react";
import ChatArea from "./ChatArea";
import InputArea from "./InputArea";
import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const documentData = location.state?.document;
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [userLanguage, setUserLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state for processing visual

  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatId = params.chatId;
      if (messages.length === 0 && chatId !== "default_chat") {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/chat/${chatId}`,
            {
              credentials: "include",
            },
          );
          if (!response.ok) throw new Error("Failed to fetch chat history");
          const data = await response.json();
          setMessages(data.chat_history);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchUserLanguage = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/profile`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserLanguage(data.user.preferred_language || "en");
      } catch (error) {
        console.error("Error fetching user language:", error);
      }
    };

    fetchChatHistory();
    fetchUserLanguage();
  }, [params.chatId, messages.length]);

  const sendMessage = async (userMessage, files) => {
    setIsLoading(true);
    setIsProcessing(true); // Show processing visual
    let chatId = params.chatId;

    if (messages.length === 0 && chatId === "default_chat") {
      chatId = uuidv4();
      navigate(`/chat/${chatId}`, { replace: true });
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const fileId = Date.now() + Math.floor(Math.random() * 1000);

        if (file.type.startsWith("image/")) {
          const formData = new FormData();
          formData.append("image_path", file);
          formData.append("user_message", userMessage);

          const uploadingMsg = {
            id: fileId,
            sender: "user",
            content: `**${userMessage}**\n\n\n*Uploading Image: ${file.name}*`,
          };
          setMessages((prev) => [...prev, uploadingMsg]);

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL
              }/handle_image?chat_id=${chatId}&language=${userLanguage}`,
              {
                method: "POST",
                body: formData,
                credentials: "include",
              },
            );
            const data = await response.json();
            const botMsg = {
              id: fileId + 1,
              sender: "bot",
              content: data.response,
            };
            setMessages((prev) => [...prev, botMsg]);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        } else if (file.type.startsWith("audio/")) {
          const formData = new FormData();
          formData.append("audio_file", file);
          formData.append("user_message", userMessage);

          const uploadingMsg = {
            id: fileId,
            sender: "user",
            content: `**${userMessage}**\n\n\n*Uploading Audio: ${file.name}*`,
          };
          setMessages((prev) => [...prev, uploadingMsg]);

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL
              }/transcribe_audio?chat_id=${chatId}&language=${userLanguage}`,
              {
                method: "POST",
                body: formData,
                credentials: "include",
              },
            );
            const data = await response.json();

            const botTranscriptionMsg = {
              id: fileId + 1,
              sender: "bot",
              content: `Explanation: ${data.response}`,
            };

            setMessages((prev) => [...prev, botTranscriptionMsg]);
          } catch (error) {
            console.error("Error transcribing audio:", error);
          }
        } else if (
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/vnd.ms-excel" ||
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "text/plain"
        ) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadingMsg = {
            id: fileId,
            sender: "user",
            content: `**${userMessage}**\n\n\n*Uploading Document: ${file.name}*`,
          };
          setMessages((prev) => [...prev, uploadingMsg]);

          try {
            const uploadResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/upload_doc`,
              {
                method: "POST",
                body: formData,
                credentials: "include",
              },
            );
            const uploadData = await uploadResponse.json();

            if (uploadData.doc_path) {
              const docResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/chat_doc`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    chat_id: chatId,
                    input_text: userMessage,
                    doc_path: uploadData.doc_path,
                    language: userLanguage,
                  }),
                },
              );
              const docData = await docResponse.json();

              const botMsg = {
                id: fileId + 1,
                sender: "bot",
                content: docData.response,
              };
              setMessages((prev) => [...prev, botMsg]);
            }
          } catch (error) {
            console.error("Error processing document:", error);
          }
        } else {
          console.warn("Unsupported file type:", file.type);
        }
      }
    } else {
      if (userMessage.trim()) {
        const userMsg = {
          id: Date.now(),
          sender: "user",
          content: userMessage,
        };
        setMessages((prev) => [...prev, userMsg]);

        // Add temporary processing message
        const processingMsg = {
          id: Date.now() + 0.5, // Use fractional ID to place before response
          sender: "bot",
          content: "",
          isProcessing: true, // Flag for processing state
        };
        setMessages((prev) => [...prev, processingMsg]);

        try {
          const payload = {
            chat_id: chatId,
            input_text: userMessage,
            language: userLanguage,
          };

          if (isFirstMessage && documentData) {
            payload.document = documentData;
            setIsFirstMessage(false);
          }

          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/chat`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              credentials: "include",
            },
          );
          const data = await response.json();

          // Remove processing message and add actual response
          setMessages((prev) => [
            ...prev.filter((msg) => msg.id !== processingMsg.id),
            {
              id: Date.now() + 1,
              sender: "bot",
              content: data.response,
              img: data?.img || null,
            },
          ]);
        } catch (error) {
          console.error("Error sending text:", error);
          // Remove processing message on error
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== processingMsg.id),
          );
        }
      }
    }
    setIsLoading(false);
    setIsProcessing(false); // Hide processing visual
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chat area */}
      <main className="flex overflow-hidden flex-col flex-1">
        <div className="overflow-y-auto p-4 h-full md:p-6 max-h-[67vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-smooth dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
            </div>
          ) : (
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              isProcessing={isProcessing}
            />
          )}
        </div>

        {/* Input area */}
        <div className="p-2 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <InputArea
            sendMessage={sendMessage}
            setMessages={setMessages}
            isLoading={isLoading || isProcessing}
            chatId={params.chatId}
          />
        </div>
      </main>
    </div>
  );
}
