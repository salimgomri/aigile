import React from 'react'
import '@testing-library/jest-dom/vitest'

// React 18 + jsdom: ensure React is in scope for JSX
;(globalThis as any).React = React
