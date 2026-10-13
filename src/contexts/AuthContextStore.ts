import { createContext } from 'react'
import type { AuthResult, AuthUser, LoginCredentials, SignupData } from '../types'

export type AuthContextValue = { user: AuthUser | null; isAuthenticated: boolean; isLoading: boolean; isDemoUser: boolean; login: (credentials: LoginCredentials) => Promise<AuthResult>; signup: (data: SignupData) => Promise<AuthResult>; logout: () => void }
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
