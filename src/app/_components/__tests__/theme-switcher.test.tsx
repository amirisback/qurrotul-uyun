import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeSwitcher } from "../theme-switcher";

// State control for mocks
let isMockMounted = false;
let currentMockTheme = "system";
const mockSetTheme = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useSyncExternalStore: (
      _subscribe: (onStoreChange: () => void) => () => void,
      getSnapshot: () => boolean,
      getServerSnapshot?: () => boolean
    ) => {
      if (isMockMounted) {
        return getSnapshot();
      }
      return getServerSnapshot ? getServerSnapshot() : getSnapshot();
    },
  };
});

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: currentMockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeSwitcher Component Unit & Accessibility Tests (TASK-003)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isMockMounted = false;
    currentMockTheme = "system";
  });

  describe("SSR & Hydration Safety (Zero-CLS)", () => {
    it("renders compact skeleton during SSR with matching height and width", () => {
      isMockMounted = false;
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-label="Memuat preferensi tema..."');
      expect(html).toContain("animate-pulse");
      expect(html).toContain("h-[34px]");
      expect(html).toContain("rounded-full");
    });

    it("renders drawer skeleton during SSR with matching height and width", () => {
      isMockMounted = false;
      const html = renderToStaticMarkup(<ThemeSwitcher variant="drawer" />);
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-label="Memuat preferensi tema..."');
      expect(html).toContain("animate-pulse");
      expect(html).toContain("h-[52px]");
      expect(html).toContain("w-full");
      expect(html).toContain("rounded-2xl");
    });
  });

  describe("Mounted Client Rendering & Accessibility (AC-03, AC-04, AC-08)", () => {
    beforeEach(() => {
      isMockMounted = true;
    });

    it("renders role='radiogroup' and 3 radio buttons with proper ARIA attributes", () => {
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).toContain('role="radiogroup"');
      expect(html).toContain('aria-label="Pilih tema tampilan"');
      expect(html).toContain('role="radio"');
      expect(html).toContain('aria-checked="true"'); // system is default
      expect(html).toContain('title="Terang"');
      expect(html).toContain('title="Gelap"');
      expect(html).toContain('title="Sistem"');
    });

    it("eliminates raw emojis and uses SVG vector icons with aria-hidden='true'", () => {
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).not.toContain("☀️");
      expect(html).not.toContain("🌙");
      expect(html).not.toContain("💻");
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('viewBox="0 0 24 24"');
    });

    it("renders active theme indicator accurately when dark mode is active", () => {
      currentMockTheme = "dark";
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).toContain('aria-label="Gelap"');
      expect(html).toContain('aria-checked="true"');
      expect(html).toContain("text-emerald-600");
    });

    it("renders drawer variant with full touch target (min-h-[48px]) and grid layout", () => {
      const html = renderToStaticMarkup(<ThemeSwitcher variant="drawer" />);
      expect(html).toContain("grid-cols-3");
      expect(html).toContain("min-h-[48px]");
      expect(html).toContain("active:scale-95");
      expect(html).toContain("Terang");
      expect(html).toContain("Gelap");
      expect(html).toContain("Sistem");
    });

    it("accepts custom label translations seamlessly", () => {
      const customLabels = {
        light: "Light Mode",
        dark: "Dark Mode",
        system: "Device Mode",
      };
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" labels={customLabels} />);
      expect(html).toContain('title="Light Mode"');
      expect(html).toContain('title="Dark Mode"');
      expect(html).toContain('title="Device Mode"');
    });
  });
});
