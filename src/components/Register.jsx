import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/otp/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      toast.success("OTP sent to your email!");
      setShowOtpField(true);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name,
      email,
      password,
      profilePic: profilePic || "",
      otp,
    };

    if (!showOtpField || !otp) {
      toast.error("Please request and enter OTP first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/user/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong, please try again.");
      toast.error(err.message || "Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-300 hover:text-white"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full p-3 mb-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
          />
          <div className="flex mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l text-white placeholder-gray-400"
              disabled={showOtpField}
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSendingOtp || showOtpField}
              className="px-4 bg-blue-500 hover:bg-blue-600 rounded-r text-white font-semibold disabled:bg-gray-500"
            >
              {isSendingOtp ? "Sending..." : showOtpField ? "Sent" : "Get OTP"}
            </button>
          </div>

          {showOtpField && (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full p-3 mb-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
            />
          )}

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={8}
              className="w-full p-3 pr-10 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-3">
            <p className="text-gray-300 text-sm mb-1">
              Profile Picture (Optional)
            </p>
            <input
              type="text"
              value={profilePic}
              onChange={(e) => {
                setProfilePic(e.target.value);
                setPreview(e.target.value);
              }}
              placeholder="Profile Pic URL"
              className="w-full p-3 mb-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white cursor-pointer"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="flex justify-center my-3">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-3 text-sm text-gray-300 hover:underline text-center"
        >
          Already have an account? Login
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Register;
