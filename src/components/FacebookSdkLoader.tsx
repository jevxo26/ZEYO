"use client";

import Script from "next/script";

export default function FacebookSdkLoader() {
  return (
    <Script
      id="facebook-jssdk"
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).FB) {
          (window as any).FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: false,
            version: "v20.0",
          });
          window.dispatchEvent(new Event("fb-sdk-ready"));
        }
      }}
    />
  );
}