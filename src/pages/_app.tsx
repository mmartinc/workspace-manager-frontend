import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type AppType } from 'next/dist/shared/lib/utils'
import { Roboto_Flex } from 'next/font/google'

import '~/styles/globals.css'

const roboto = Roboto_Flex({ subsets: ['latin'] })
const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  )
}

export default MyApp
