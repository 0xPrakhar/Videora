import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import Input from "../component/Input";

function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");

    console.log(data);

    // Business logic later — replace with your real login request.
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      navigate("/");
    } catch (error) {
      setError("Couldn't log you in. Check your details and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit(login)}
        className="w-full max-w-lg rounded-3xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 sm:p-10 shadow-2xl shadow-black/50"
      >
        {/* Heading */}
        <h2 className="text-center text-white text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back
        </h2>
        <p className="text-center text-zinc-400 mt-2 mb-8 text-base">
          Log in to continue to Videora.
        </p>

        <div className="space-y-6">
          <Input
            label="Email or Username"
            placeholder=" "
            type="text"
            {...register("identifier", {
              required: "Email or username is required",
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
                onClick={() => setShowPassword((v) => !v)}
                className="text-sm text-zinc-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
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
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <p className="text-center text-zinc-400">
            Don't have an account?
            <span
              onClick={() => navigate("/signup")}
              className="text-cyan-400 ml-2 cursor-pointer hover:underline underline-offset-2"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;