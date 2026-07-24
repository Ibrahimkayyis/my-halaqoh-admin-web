import "@testing-library/jest-dom/vitest";
import { vi, afterEach } from "vitest";

import { useAuthStore } from "@/stores/auth.store";

// Mock Firebase Config & App Init to prevent API key errors during unit tests
vi.mock("@/lib/firebase/config", () => ({
  app: {},
  auth: {},
  db: {},
  storage: {},
}));

// Singleton mock router to assert router method calls across tests
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

// 1. Polyfill ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 2. Polyfill PointerEvent for Radix Select / Dialog
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    hasPointerCapture = () => false;
    releasePointerCapture = () => {};
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.PointerEvent = PointerEvent as any;
}

// 3. Polyfill Element methods
Element.prototype.scrollIntoView = vi.fn();

// 4. Polyfill matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 5. Mock Next.js Navigation (useRouter, usePathname, useSearchParams)
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// 6. Clear mocks and reset Zustand stores after each test to prevent cross-test leakage
afterEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: null, status: "unauthenticated", errorMessage: null });
});
