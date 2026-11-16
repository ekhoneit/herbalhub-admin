import { Inter, Manrope, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { PermissionProvider } from "@/context/PermissionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata() {
  let faviconUrl = "/herbalhub-favicon.png";
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/store-settings`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.favicon) {
        faviconUrl = data.data.favicon;
      }
    }
  } catch (e) {
    // fallback to /herbalhub.png
  }

  return {
    title: "Herbalhub Admin Portal",
    description: "Herbalhub Ecommerce Management & Admin Dashboard",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} ${hindSiliguri.variable} antialiased font-sans`}
      >
        <PermissionProvider>
          {children}
          <Toaster
            toastOptions={{
              style: {
                background: "#102D50",
                color: "#FFFFFF",
                borderRadius: "10px",
              },
            }}
          />
        </PermissionProvider>
      </body>
    </html>
  );
}
