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
    template: "Vaid - #1 en Soluciones de Gestión para Organizaciones Sin Fines de Lucro",
    default: "Vaid - #1 en Soluciones de Gestión para Organizaciones Sin Fines de Lucro",
  },
  description:
    "Vaid es una plataforma innovadora diseñada para optimizar la gestión en organizaciones sin fines de lucro. Con el poder de la inteligencia artificial, Vaid simplifica la administración de recursos, reclutamiento, eventos y tareas, permitiendo a las ONG centrarse en maximizar su impacto social. Fácil de usar, eficiente y escalable, es la herramienta perfecta para transformar tu organización.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Vaid" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
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
