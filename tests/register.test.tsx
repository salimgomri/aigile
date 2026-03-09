import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RegisterPage from '@/app/register/page'

vi.mock('@/lib/auth-client', () => ({
  signUp: {
    email: vi.fn().mockResolvedValue({ error: null }),
  },
  requestPasswordReset: vi.fn().mockResolvedValue({ error: null }),
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form', () => {
    render(<RegisterPage />)
    expect(screen.getByText(/Créer un compte AIgile/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Salim/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Gomri/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/votre@email.com/i)).toBeInTheDocument()
    expect(screen.getByText(/Rôle \*/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Créer mon compte/i })).toBeInTheDocument()
  })

  it('shows error when role is not selected', async () => {
    render(<RegisterPage />)
    const form = screen.getByRole('button', { name: /Créer mon compte/i }).closest('form')!
    fireEvent.submit(form)
    expect(await screen.findByText(/Veuillez sélectionner un rôle/i)).toBeInTheDocument()
  })

  it('has link to login', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('link', { name: /Se connecter/i })).toHaveAttribute('href', '/login')
  })
})
