import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock window.fs for file operations (used in analysis tool)
  Object.defineProperty(window, 'fs', {
    value: {
      readFile: vi.fn().mockResolvedValue(new Uint8Array()),
    },
    writable: true,
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock DragEvent for drag & drop tests
  global.DragEvent = class extends Event {
    dataTransfer: any
    
    constructor(type: string, eventInitDict?: any) {
      super(type, eventInitDict)
      this.dataTransfer = {
        dropEffect: 'none',
        effectAllowed: 'all',
        files: [],
        items: [],
        types: [],
        clearData: vi.fn(),
        getData: vi.fn(),
        setData: vi.fn(),
        setDragImage: vi.fn(),
      }
    }
  }

  // Mock HTMLElement.scrollIntoView
  HTMLElement.prototype.scrollIntoView = vi.fn()
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Suppress console warnings in tests unless explicitly needed
const originalConsoleWarn = console.warn
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render') ||
     args[0].includes('Warning: render') ||
     args[0].includes('Cannot nest sections'))
  ) {
    return
  }
  originalConsoleWarn(...args)
}
