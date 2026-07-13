"use client";

import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "sonner";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function SocialLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [fbLoaded, setFbLoaded] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

  // SDK is loaded + initialized globally via next/script in layout.tsx,
  // which dispatches "fb-sdk-ready" once FB.init() has run.
  useEffect(() => {
    if (!facebookAppId) return;

    // Already ready (e.g. fast refresh / navigating back to this page)
    if (window.FB) {
      setFbLoaded(true);
      return;
    }

    const handleReady = () => setFbLoaded(true);
    window.addEventListener("fb-sdk-ready", handleReady);

    return () => window.removeEventListener("fb-sdk-ready", handleReady);
  }, [facebookAppId]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch("/api/auth/social-login/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();

      if (data.success) {
        dispatch(setCredentials({ user: data.data.user, token: data.data.token }));
        toast.success("Logged in with Google");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Google login failed");
      }
    } catch (err) {
      console.error("Error during google signin", err);
      toast.error("Something went wrong with Google sign in");
    }
  };

  const handleFacebookResponse = async (accessToken: string) => {
    try {
      const res = await fetch("/api/auth/social-login/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();

      if (data.success) {
        dispatch(setCredentials({ user: data.data.user, token: data.data.token }));
        toast.success("Logged in with Facebook");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Facebook login failed");
      }
    } catch (err) {
      console.error("Error during facebook login", err);
      toast.error("Something went wrong with Facebook sign in");
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error("Facebook SDK is still loading, please try again in a moment");
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse?.accessToken) {
          handleFacebookResponse(response.authResponse.accessToken);
        } else {
          toast.error("Facebook login cancelled");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error("Google Login Failed");
                toast.error("Google login failed");
              }}
              useOneTap
            />
          </div>
        </GoogleOAuthProvider>
      ) : (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
          Configure NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google Login
        </div>
      )}

      {facebookAppId ? (
        <button
          onClick={handleFacebookLogin}
          disabled={!fbLoaded}
          className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white p-2 rounded-md hover:bg-[#166FE5] transition-colors shadow-sm font-medium h-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
          {fbLoaded ? "Log in with Facebook" : "Loading Facebook..."}
        </button>
      ) : (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
          Configure NEXT_PUBLIC_FACEBOOK_APP_ID to enable Facebook Login
        </div>
      )}
    </div>
  );
}