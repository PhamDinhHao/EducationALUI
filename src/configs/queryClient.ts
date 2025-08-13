/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Mutation, MutationCache, Query, QueryCache, QueryClient, QueryKey } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  },
  queryCache: new QueryCache({
    onSuccess: (_data: unknown, query: Query<unknown, unknown, unknown, QueryKey>): void => {
      if (query.meta?.SUCCESS_MESSAGE) {
        toast.success(`${query.meta.SUCCESS_MESSAGE}`)
      }
    },
    onError: (error: unknown, query: Query<unknown, unknown, unknown, QueryKey>): void => {
      if (axios.isAxiosError(error) && query.meta?.ERROR_SOURCE) {
        toast.error(`${query.meta.ERROR_SOURCE}: ${error.response?.data?.message}`)
      }
      if (error instanceof Error && !(error instanceof AxiosError) && query.meta?.ERROR_SOURCE) {
        toast.error(`${query.meta.ERROR_SOURCE}: ${error.message}`)
      }
    }
  }),
  mutationCache: new MutationCache({
    onError: (
      error: unknown,
      _variables: unknown,
      _context: unknown,
      mutation: Mutation<unknown, unknown, unknown, unknown>
    ): void => {
      if (error instanceof AxiosError && mutation.meta?.ERROR_SOURCE) {
        toast.error(`${mutation.meta.ERROR_SOURCE}: ${error.response?.data?.message}`)
      }
      if (error instanceof Error && !(error instanceof AxiosError) && mutation.meta?.ERROR_SOURCE) {
        toast.error(`${mutation.meta.ERROR_SOURCE}: ${error.message}`)
      }
    },
    onSuccess: (
      _data: unknown,
      _variables: unknown,
      _context: unknown,
      mutation: Mutation<unknown, unknown, unknown, unknown>
    ): void => {
      if (mutation.meta?.SUCCESS_MESSAGE) {
        toast.success(`${mutation.meta.SUCCESS_MESSAGE}`)
      }
    }
  })
})
