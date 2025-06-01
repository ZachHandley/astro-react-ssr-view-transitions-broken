import { type ReactNode } from "react";
import {
  CrossmintProvider as CrossmintSDKProvider,
  CrossmintAuthProvider,
} from "@crossmint/client-sdk-react-ui";
import { CROSSMINT_API_KEY } from "astro:env/client";

// Simple AuthLoading component
const AuthLoading = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
};

interface ProviderProps {
  children?: ReactNode;
}

export default function CrossmintProvider({ children }: ProviderProps) {
  return (
    <CrossmintSDKProvider apiKey={CROSSMINT_API_KEY}>
      <CrossmintAuthProvider
        authModalTitle="Connect or create your account"
        loginMethods={["email", "google"]}
        refreshRoute={`${import.meta.env.SITE}/api/auth/refresh.json`}
        logoutRoute={`${import.meta.env.SITE}/api/auth/logout.json`}
        embeddedWallets={{
          type: "evm-smart-wallet",
          createOnLogin: "all-users",
        }}
      >
        {children}
      </CrossmintAuthProvider>
    </CrossmintSDKProvider>
  );
}
