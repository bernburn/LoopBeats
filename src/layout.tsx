// Using inline types to avoid depending on global React types during compile
import "./globals.css";
import { Providers } from "./providers";
import FarcasterWrapper from "@/components/FarcasterWrapper";

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* provider requires children */}
          <FarcasterWrapper>{children}</FarcasterWrapper>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "BeatItBase Pro DAW",
  description:
    "Create beats with BeatItBase: a pro DAW blending music production and blockchain for NFT minting. Enjoy sophisticated features and secure NFT integration in an intuitive interface.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl:
        "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_0075b047-a0ec-4d6f-a146-b3f979c01613-aIFs4V3zQKP1SIh0IBeJz09XUDclp3",
      button: {
        title: "Open with Ohara",
        action: {
          type: "launch_frame",
          name: "BeatItBase Pro DAW",
          url: "https://up-wheel-789.app.ohara.ai",
          splashImageUrl:
            "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#ffffff",
        },
      },
    }),
  },
};
