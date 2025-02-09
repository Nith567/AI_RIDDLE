"use client";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { createWalletClient, createPublicClient } from "viem";
import { http } from "wagmi";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { arbitrumSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "AI-Contest Riddle dapp",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "3edba4009c97c98400b0c8df8ca3d590",
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(
      "https://arb-sepolia.g.alchemy.com/v2/XxWU7n2c8z5Wtte1dxeOkplsldBXm2vO"
    ),
  },
  ssr: true,
});

export const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: http(),
});
export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(
    "https://arb-sepolia.g.alchemy.com/v2/XxWU7n2c8z5Wtte1dxeOkplsldBXm2vO"
  ),
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#111111",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
