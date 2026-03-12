import path from 'path'
import { config } from 'dotenv'
import React from 'react'
import '@testing-library/jest-dom/vitest'

// Charger .env.local avant tout import (Supabase, etc.)
config({ path: path.resolve(process.cwd(), '.env.local') })

// React 18 + jsdom: ensure React is in scope for JSX
;(globalThis as any).React = React
