import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";

import Input from "../component/Input";

function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showPassword,setShowPassword]=useState(false)

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("avatar", e.target.files);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const accountCreate = async (data) => {
    setError("");

    console.log(data);

    // Business logic later — replace with your real signup request.
    await new Promise((resolve) => setTimeout(resolve, 800));

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit(accountCreate)}
        className="w-full max-w-lg rounded-3xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 sm:p-10 shadow-2xl shadow-black/50"
      >
        {/* Heading */}
        <h2 className="text-center text-white text-3xl sm:text-4xl font-bold tracking-tight">
          Create your account
        </h2>
        <p className="text-center text-zinc-400 mt-2 mb-8 text-base">
          Start your journey with Videora.
        </p>

        <div className="space-y-6">
          <Input
            label="Full Name"
            placeholder=" "
            type="text"
            {...register("fullName", {
              required: "Full name is required",
            })}
          />

          <Input
            label="Username"
            placeholder=" "
            type="text"
            {...register("username", {
              required: "Username is required",
            })}
          />

          <Input
            label="Email"
            placeholder=" "
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid Email",
              },
            })}
          />

        <Input
  label="Password"
  type={showPassword ? "text" : "password"}
  {...register("password", {
    required: "Password is required",
  })}
  rightElement={
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-sm text-zinc-400 hover:text-white"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  }
/>
          {/* Avatar — self-upload only, no presets */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative w-16 h-16 shrink-0 rounded-full border-2 border-dashed border-zinc-600 hover:border-cyan-400 overflow-hidden flex items-center justify-center text-zinc-500 hover:text-cyan-400 transition-colors duration-200"
              aria-label="Upload your avatar"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl leading-none">+</span>
              )}
            </button>

            <div className="flex flex-col gap-0.5">
              <p className="text-zinc-300 text-sm font-medium">
                {avatarPreview ? "Photo selected" : "Profile photo"}
              </p>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-cyan-400 text-sm text-left hover:underline underline-offset-2 w-fit"
              >
                {avatarPreview ? "Change photo" : "Upload photo (optional)"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Cover image */}
          <Input
            label="Cover Image (Optional)"
            type="file"
            accept="image/*"
            {...register("coverImage")}
          />

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-lg font-semibold rounded-xl bg-white text-black flex items-center justify-center gap-2 border border-transparent transition-all duration-150 ${
              isSubmitting
                ? "opacity-80 cursor-not-allowed"
                : "hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-white/10"
            }`}
          >
            {isSubmitting && (
              <span
                className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin"
                aria-hidden="true"
              />
            )}
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-zinc-400">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-cyan-400 ml-2 cursor-pointer hover:underline underline-offset-2"
            >
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;