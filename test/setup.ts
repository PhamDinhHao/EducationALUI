import '@testing-library/jest-dom' // Provides custom matchers for jest
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
