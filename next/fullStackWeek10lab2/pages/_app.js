import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import { GlobalContextProvider } from './store/globalContext'
import StartupPopup from '../components/ui/StartupPopup'

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <StartupPopup />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalContextProvider>
  );
}

export default MyApp
