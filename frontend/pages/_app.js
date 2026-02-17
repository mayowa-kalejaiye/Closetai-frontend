import '../styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../context/AuthContext'
import Header3 from '../components/Header3'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <Header3 />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
