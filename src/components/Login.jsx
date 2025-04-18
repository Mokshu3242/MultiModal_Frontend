import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        toast.error(data.detail || "Login failed");
      } else {
        localStorage.setItem("isAuthenticated", data.isAuthenticated);
        toast.success("Login successful! Redirecting to home...");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-300 hover:text-white"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="relative p-6 w-full max-w-md bg-gray-800 rounded-lg shadow-lg">
        {/* Back Button */}

        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        {error && <p className="mt-2 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="p-3 mb-3 w-full placeholder-gray-400 text-white bg-gray-700 rounded"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-3 pr-10 mb-3 w-full placeholder-gray-400 text-white bg-gray-700 rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex absolute inset-y-0 right-3 items-center text-gray-300"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          <button className="p-3 w-full font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <button
          onClick={() => navigate("/register")}
          className="mt-3 w-full text-sm text-center text-gray-300 hover:underline"
        >
          Don&apos;t have an account? Sign up
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

export default Login;
