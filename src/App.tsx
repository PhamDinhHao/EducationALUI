import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/configs/queryClient'
import RoutesApp from '@/routes'
import { GlobalHistory } from '@/shared/components/GlobalHistory/GlobalHistory'

const App = () => {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RoutesApp />
        <GlobalHistory />
      </QueryClientProvider>
    </>
  )
}

export default App
