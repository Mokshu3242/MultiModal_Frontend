import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile. Please try again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("An error occurred while updating the profile.");
    }
  };

  const sendOtp = async () => {
    if (!user?.email) {
      toast.error("No email found");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/request`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      toast.success("OTP sent to your email!");
      setShowOtpField(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/auth/delete-account`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, otp }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      setAvatarOpen(false);
      navigate("/Landingpage");
      window.location.reload();

    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message || "An error occurred while deleting the account.");
    } finally {
      setIsDeleting(false);
      setPassword("");
      setOtp("");
      setShowDeleteConfirm(false);
      setShowOtpField(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-10">
        {!isEditing ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-4 sm:p-6 md:p-8">
            {user && (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 sm:mb-6">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-600"
                  />
                </div>
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                    {user.name}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-red-600 dark:text-red-400">
                    Confirm Account Deletion
                  </h3>
                  <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Enter your password to confirm:
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      placeholder="Your password"
                      autoFocus
                    />
                  </div>

                  {!showOtpField ? (
                    <button
                      onClick={sendOtp}
                      disabled={isSendingOtp || !password}
                      className={`w-full mb-3 sm:mb-4 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-white font-medium text-sm sm:text-base ${isSendingOtp || !password ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isSendingOtp ? "Sending OTP..." : "Send OTP Verification"}
                    </button>
                  ) : (
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Enter OTP sent to your email:
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                        placeholder="6-digit OTP"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="mb-3 sm:mb-4 text-red-500 text-xs sm:text-sm">{error}</div>
                  )}

                  <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setPassword("");
                        setOtp("");
                        setError(null);
                        setShowOtpField(false);
                      }}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white font-medium text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={!password || !otp || isDeleting}
                      className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white font-medium text-sm sm:text-base ${!password || !otp || isDeleting ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 sm:mb-8">
              Edit Profile
            </h2>
            <form onSubmit={updateProfile} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Profile Picture (Upload File)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setUser({ ...user, profilePic: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200 text-sm sm:text-base"
                    accept="image/*"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Profile Picture (Image URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => setUser({ ...user, profilePic: imageUrl })}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-sm sm:text-base"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
