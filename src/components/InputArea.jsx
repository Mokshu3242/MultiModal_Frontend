import { useState, useEffect } from "react";
import {
  Paperclip,
  Send,
  Mic,
  AudioLines,
  X,
  Music,
  FileTextIcon,
  File,
  ImageIcon,
  AudioLinesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReactMediaRecorder } from "react-media-recorder";
import { useTranslation } from "react-i18next";
import "../styles/index.css";
import PropTypes from "prop-types";

export default function InputArea({ sendMessage, setMessages, chatId }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [files, setFiles] = useState([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Audio recording
  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: async (_, blob) => {
      console.log("Audio recording stopped:", blob);
      const formData = new FormData();
      formData.append("audio", blob, "audio.wav");
      formData.append("chat_id", chatId);
      const fileId = Date.now() + Math.floor(Math.random() * 1000);
      const uploadingMsg = {
        id: fileId,
        sender: "user",
        content: `User audio sent`,
      };
      setMessages((prev) => [...prev, uploadingMsg]);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/audio?chat_id=${chatId}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const botMsg = {
          id: fileId + 1,
          sender: "bot",
          content: data["response"],
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        console.error("Error sending audio:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            content: "⚠️ Error processing audio message",
          },
        ]);
      }
    },
  });

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  // Voice Chat
  const {
    startRecording: startVoiceRecording,
    stopRecording: stopVoiceRecording,
  } = useReactMediaRecorder({
    audio: true,
    onStop: async (_, blob) => {
      try {
        console.log("Audio recording stopped:", blob);

        const formData = new FormData();
        formData.append("voice", blob, "audio.wav");
        formData.append("chat_id", chatId);

        const fileId = Date.now() + Math.floor(Math.random() * 1000);

        setMessages((prev) => [
          ...prev,
          { id: fileId, sender: "user", content: "User audio sent 🎤" },
        ]);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voice?chat_id=${chatId}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!response.ok) throw new Error("Voice processing failed");

        const resBlob = await response.blob();
        const audioUrl = URL.createObjectURL(resBlob);
        const audio = new Audio(audioUrl);

        setMessages((prev) => [
          ...prev,
          { id: fileId + 1, sender: "bot", content: "Bot audio received 🤖" },
        ]);

        await audio.play();
      } catch (error) {
        console.error("Error in voice chat:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            content: "⚠️ Error processing voice message",
          },
        ]);
      }
    },
  });

  const handleVoiceRecord = () => {
    if (isVoiceRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
    setIsVoiceRecording(!isVoiceRecording);
  };

  // Send message
  const handleSend = () => {
    sendMessage(message, files);
    setMessage("");
    setFiles([]);
  };

  // Handle file uploads with 2MB limit for documents
  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).filter(file => {
      // Check if file is a document type and under 2MB (2 * 1024 * 1024 bytes)
      const isDocument = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].includes(file.type);
      
      if (isDocument && file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 2MB limit and won't be uploaded`);
        return false;
      }
      return true;
    });
    
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".upload-menu") &&
        !event.target.closest(".upload-button")
      ) {
        setShowUploadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative mx-auto mb-4 w-full max-w-2xl border shadow-xl border-gray-200/80 rounded-[1.5rem] backdrop-blur-lg bg-white/95 dark:border-gray-700/50 dark:bg-[#2d2f3d]/95">
        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 p-4 pt-2 rounded-xl border border-gray-200 shadow-md dark:border-gray-700 bg-white/60 backdrop-blur-lg dark:bg-[#1F1F2E]/60">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg transition-shadow transform hover:shadow-xl hover:scale-105 group dark:from-[#2D2F3D] dark:to-[#1F1F2E]"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-20 h-20 rounded-lg shadow-md"
                  />
                ) : file.type === "application/pdf" ||
                  file.type ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  file.type === "text/plain" ||
                  file.type ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                  <div className="flex flex-col justify-center items-center w-20 h-20 bg-gray-100 rounded-lg shadow-md dark:bg-[#2D2F3D]">
                    <FileTextIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <span className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[90px]">
                      {file.name}
                    </span>
                  </div>
                ) : file.type.startsWith("audio/") ? (
                  <div className="flex flex-col justify-center items-center w-20 h-20 bg-gray-100 rounded-lg shadow-md dark:bg-[#2D2F3D]">
                    <Music className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <span className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[90px]">
                      {file.name}
                    </span>
                  </div>
                ) : null}
                <X
                  className="absolute -top-2 -right-2 w-6 h-6 text-gray-400 transition-transform transform cursor-pointer dark:text-gray-500 hover:text-red-500 hover:scale-110"
                  onClick={() => handleRemoveFile(index)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Suggested Messages & Files Header */}
        <div className="flex gap-3 justify-between items-center px-4 pt-3 pb-2">
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              className="py-2 px-4 text-white bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg transition-all transform dark:from-blue-600 dark:to-blue-500 hover:opacity-80 hover:scale-105"
              onClick={() => setShowFiles(!showFiles)}
            >
              <span className="text-sm font-medium">
                {t("files")} ({files.length})
              </span>
            </Button>

            {showFiles && files.length > 0 && (
              <div className="flex overflow-x-auto gap-2 items-center ml-2 animate-fade-in max-w-[200px] scrollbar-thin scrollbar-thumb-gray-300">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex gap-1.5 items-center py-1 px-2.5 rounded-full bg-gray-100/50 dark:bg-[#3b414d]/60"
                  >
                    <span className="text-xs text-gray-600 truncate max-w-[120px]">
                      {file.name}
                    </span>
                    <X
                      className="w-3.5 h-3.5 text-gray-400 transition-colors cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveFile(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Input Area */}
        <div className="flex gap-2 items-center p-4 pt-0">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl transition-colors shrink-0 upload-button hover:bg-gray-100/60"
            onClick={() => setShowUploadMenu(!showUploadMenu)}
            title={t("upload")}
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>

          {showUploadMenu && (
            <div className="flex absolute left-2 bottom-16 z-0 flex-col gap-2 p-2 bg-white rounded-xl border shadow-xl upload-menu border-gray-200/50 dark:bg-[#1F2937]">
              {/* Document Upload Button */}
              <label
                className="flex gap-3 items-center py-2.5 px-4 rounded-lg transition-colors cursor-pointer hover:bg-gray-100/50"
                onClick={() =>
                  document.getElementById("documentUpload").click()
                }
              >
                <File className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t("documents")}
                </span>
              </label>
              <input
                multiple
                id="documentUpload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Image Upload Button */}
              <label
                className="flex gap-3 items-center py-2.5 px-4 rounded-lg transition-colors cursor-pointer hover:bg-gray-100/50"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                <ImageIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t("image")}
                </span>
              </label>
              <input
                multiple
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Audio Upload Button */}
              <label
                className="flex gap-3 items-center py-2.5 px-4 rounded-lg transition-colors cursor-pointer hover:bg-gray-100/50"
                onClick={() => document.getElementById("audioUpload").click()}
              >
                <AudioLinesIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t("audio")}
                </span>
              </label>
              <input
                id="audioUpload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messagePlaceholder") || "Type your message here..."}
            className="flex-grow py-3 px-6 text-sm rounded-2xl shadow-inner transition-all resize-none focus:ring-2 bg-gray-100/60 placeholder:text-gray-500/80 dark:bg-[#3b414d]/60 dark:placeholder:text-gray-400/80 focus:ring-blue-500/50"
          />

          <div className="flex gap-1.5 items-center">
            <Button
              onClick={handleRecord}
              variant="ghost"
              size="icon"
              className="relative rounded-xl transition-colors shrink-0 hover:bg-gray-100/60"
              title={t("record")}
            >
              <Mic
                className={`h-5 w-5 ${isRecording ? "text-red-500" : "text-muted-foreground"
                  }`}
              />
              {isRecording && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>

            {message.trim() || files.length > 0 ? (
              <Button
                onClick={handleSend}
                className="py-3 px-6 text-white bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl transition-all hover:scale-105 shrink-0"
                size="icon"
                title={t("send")}
              >
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl transition-colors shrink-0 hover:bg-gray-100/60"
                title={t("audioChat")}
                onClick={() => setShowVoiceModal(true)}
              >
                <AudioLines
                  className={`w-5 h-5 text-muted-foreground ${isVoiceRecording ? "text-red-500 animate-pulse" : ""
                    }`}
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Voice Modal */}
      {showVoiceModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center text-white">
            <div
              className={`w-40 h-40 rounded-full ${isVoiceRecording ? "bg-red-500 animate-pulse" : "bg-white"
                }`}
            ></div>
            <p className="mt-4 text-sm opacity-80">
              {isVoiceRecording
                ? "Recording..."
                : "Tap the mic to start recording"}
            </p>
            <div className="flex gap-6 mt-6">
              <button
                onClick={handleVoiceRecord}
                className={`w-14 h-14 flex items-center justify-center rounded-full transition 
            ${isVoiceRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-gray-800 hover:bg-gray-700"
                  }`}
              >
                <Mic className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="flex justify-center items-center w-14 h-14 bg-gray-800 rounded-full hover:bg-gray-700"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

InputArea.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
};
