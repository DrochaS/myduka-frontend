import '@testing-library/jest-dom/vitest'

const memoryStore = new Map()

const localStorageMock = {
  getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
  setItem: (key, value) => {
    memoryStore.set(String(key), String(value))
  },
  removeItem: (key) => {
    memoryStore.delete(key)
  },
  clear: () => {
    memoryStore.clear()
  },
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})
