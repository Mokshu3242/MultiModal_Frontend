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
        }
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
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors duration-200"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        {" "}
        {/* Increased padding to p-10 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>
        {error && (
          <p className="mb-4 p-3 text-center text-red-400 bg-red-900/50 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Sign in
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
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
        toastClassName="bg-gray-800 text-white"
        progressClassName="bg-blue-500"
      />
    </div>
  );
};

export default Login;
