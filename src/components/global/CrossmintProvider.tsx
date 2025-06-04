import React, { type ReactNode, useState } from "react";
import {
  CrossmintProvider as CrossmintSDKProvider,
  CrossmintAuthProvider,
  useAuth,
  useCrossmint,
} from "@crossmint/client-sdk-react-ui";
import { useMount } from "@reactuses/core";
import { CROSSMINT_API_KEY } from "astro:env/client";
import { Icon } from "@iconify/react";
import { navigate } from "astro:transitions/client";

const AuthLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-40 bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-4">
        <Icon
          icon="tabler:loader"
          className="animate-spin text-white text-4xl"
        />
      </div>
    </div>
  );
};

const LoginScreen = () => {
  const { login, logout } = useAuth();

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="text-white text-xl">Login</div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={login}
        >
          Login
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const AuthenticatedContent = ({ children }: { children: ReactNode }) => {
  const { user, jwt } = useAuth();
  const { setJwt, experimental_setAuth, crossmint } = useCrossmint();
  const [hasTriedAuth, setHasTriedAuth] = useState(false); // ✅ Use state, not ref
  const [authenticated, setAuthenticated] = useState(false); // ✅ Use state, not ref

  const authenticate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.SITE}/api/auth/get.json`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.user) {
        console.log("User is authenticated");
        setJwt(data.session.jwt);
        experimental_setAuth(data.user);
        crossmint.user = data.user;
        crossmint.jwt = data.session.jwt;
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setHasTriedAuth(true); // ✅ Always set this, even on error
    }
  };

  useMount(() => {
    authenticate();
  });

  // ✅ Fixed logic
  if (!hasTriedAuth) {
    return <AuthLoadingScreen />; // Show loading while checking auth
  }

  if (authenticated) {
    return <>{children}</>; // Show content if authenticated
  }

  return <LoginScreen />; // Show login if not authenticated
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
        onLoginSuccess={() => {
          navigate("/");
        }}
        termsOfServiceText="By connecting, you agree to our terms of service."
      >
        <AuthenticatedContent>{children}</AuthenticatedContent>
      </CrossmintAuthProvider>
    </CrossmintSDKProvider>
  );
}
