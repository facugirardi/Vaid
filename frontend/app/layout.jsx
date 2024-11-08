import Preloader from "@/components/Preloader";
import "@css/aos.css";
import "@css/bootstrap.min.css";
import "@css/flaticon.min.css";
import "@css/fontawesome-5.14.0.min.css";
import "@css/magnific-popup.min.css";
import "@css/nice-select.min.css";
import "@css/slick.min.css";
import "@css/style.css";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomProvider from "@/redux/provider";
import { Setup } from '@/components/utils'
import CustomPersist from "@/redux/persistgate";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "Vaid",
    default: "Vaid",
  },
  description: "AI Management Solutions for Nonprofits",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <CustomProvider>
          <CustomPersist>
            <Setup />
            <Preloader />
            {children}
          </CustomPersist>
        </CustomProvider>
      </body>
    </html>
  );
}
