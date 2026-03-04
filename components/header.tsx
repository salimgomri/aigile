'use client'

import { useTheme } from './theme-provider'
import { useLanguage } from './language-provider'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  return (
    <>
      {/* Theme Toggle */}
      <div className="fixed top-5 left-5 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg rounded-full p-2 shadow-lg">
        <button
          onClick={() => setTheme('default')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            theme === 'default'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sarah
        </button>
        <button
          onClick={() => setTheme('apple')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            theme === 'apple'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Maya
        </button>
      </div>

      {/* Language Toggle */}
      <div className="fixed top-5 right-5 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg rounded-full p-2 shadow-lg flex gap-1">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            language === 'en'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('fr')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            language === 'fr'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          FR
        </button>
      </div>
    </>
  )
}
