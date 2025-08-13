import { render, screen } from '@testing-library/react'
import Greet from '@/shared/components/Greet'
import { describe, expect, it } from 'vitest'

describe('Greet', () => {
  it('should render Hello with the name when name is provided', () => {
    render(<Greet name='Mosh' />)
    expect(screen.getByText(/Hello Mosh!/i)).toBeInTheDocument()
  })
})
