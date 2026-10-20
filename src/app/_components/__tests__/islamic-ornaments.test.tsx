import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  IslamicBackgroundPattern,
  RubElHizb,
  RamadanHilal,
  RamadanFanous,
  IslamicDivider,
  TazhibCorner,
  RamadanPillBadge,
} from "../islamic-ornaments";

describe("Islamic Ornaments QA & Accessibility Audit", () => {
  describe("IslamicBackgroundPattern (AC-01)", () => {
    it("renders with pointer-events-none and aria-hidden to prevent interaction blocking", () => {
      const html = renderToStaticMarkup(<IslamicBackgroundPattern />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("fixed inset-0");
      expect(html).toContain('id="islamic-ambient-lattice"');
    });

    it("applies subtle opacity defaults strictly bounded between 3% and 6%", () => {
      const html = renderToStaticMarkup(<IslamicBackgroundPattern />);
      expect(html).toContain("opacity-[0.035]");
      expect(html).toContain("dark:opacity-[0.055]");
    });

    it("allows custom opacity and class overrides without breaking accessibility", () => {
      const html = renderToStaticMarkup(
        <IslamicBackgroundPattern
          className="custom-layer"
          opacityClassName="opacity-[0.04] dark:opacity-[0.05]"
        />
      );
      expect(html).toContain("custom-layer");
      expect(html).toContain("opacity-[0.04]");
      expect(html).toContain('aria-hidden="true"');
    });
  });

  describe("RubElHizb (AC-04)", () => {
    it("renders with aria-hidden='true' and 8-point geometric star elements", () => {
      const html = renderToStaticMarkup(<RubElHizb />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('viewBox="0 0 24 24"');
      expect(html).toContain('transform="rotate(45 12 12)"');
    });

    it("supports named sizes (sm, md, lg, xl)", () => {
      const sm = renderToStaticMarkup(<RubElHizb size="sm" />);
      const md = renderToStaticMarkup(<RubElHizb size="md" />);
      const lg = renderToStaticMarkup(<RubElHizb size="lg" />);
      const xl = renderToStaticMarkup(<RubElHizb size="xl" />);

      expect(sm).toContain("w-4 h-4");
      expect(md).toContain("w-6 h-6");
      expect(lg).toContain("w-8 h-8");
      expect(xl).toContain("w-12 h-12");
    });

    it("supports numeric dimensions", () => {
      const html = renderToStaticMarkup(<RubElHizb size={32} />);
      expect(html).toContain('width:32px');
      expect(html).toContain('height:32px');
    });
  });

  describe("RamadanHilal (AC-02)", () => {
    it("renders crescent moon with aria-hidden, pointer-events-none, and select-none", () => {
      const html = renderToStaticMarkup(<RamadanHilal />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("select-none");
      expect(html).toContain('id="hilal-crescent-grad"');
    });

    it("conditionally renders starlight glow backdrop", () => {
      const withGlow = renderToStaticMarkup(<RamadanHilal glow={true} />);
      const withoutGlow = renderToStaticMarkup(<RamadanHilal glow={false} />);

      expect(withGlow).toContain("blur-2xl");
      expect(withoutGlow).not.toContain("blur-2xl");
    });
  });

  describe("RamadanFanous (AC-02)", () => {
    it("renders traditional lantern with cord, tiers, and tassel with non-blocking properties", () => {
      const html = renderToStaticMarkup(<RamadanFanous cordLength={30} />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("select-none");
      expect(html).toContain('viewBox="0 0 80 136"');
      expect(html).toContain('id="fanous-glow-grad"');
    });

    it("toggles ambient glow properly", () => {
      const withGlow = renderToStaticMarkup(<RamadanFanous glow={true} />);
      const withoutGlow = renderToStaticMarkup(<RamadanFanous glow={false} />);

      expect(withGlow).toContain("blur-xl");
      expect(withoutGlow).not.toContain("blur-xl");
    });
  });

  describe("IslamicDivider (AC-04)", () => {
    it("renders symmetrical section divider with Rub el Hizb centerpiece and pointer-events-none", () => {
      const html = renderToStaticMarkup(<IslamicDivider />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("select-none");
      expect(html).toContain('id="div-fade-left"');
      expect(html).toContain('id="div-fade-right"');
    });

    it("supports variant themes (default, gold, emerald)", () => {
      const def = renderToStaticMarkup(<IslamicDivider variant="default" />);
      const gold = renderToStaticMarkup(<IslamicDivider variant="gold" />);
      const emerald = renderToStaticMarkup(<IslamicDivider variant="emerald" />);

      expect(def).toContain("text-border");
      expect(gold).toContain("text-amber-500/60");
      expect(emerald).toContain("text-primary/60");
    });
  });

  describe("TazhibCorner (AC-03)", () => {
    it("supports all 4 corner positions with appropriate flip/mirror CSS transforms", () => {
      const tl = renderToStaticMarkup(<TazhibCorner position="top-left" />);
      const tr = renderToStaticMarkup(<TazhibCorner position="top-right" />);
      const bl = renderToStaticMarkup(<TazhibCorner position="bottom-left" />);
      const br = renderToStaticMarkup(<TazhibCorner position="bottom-right" />);

      expect(tl).toContain("top-0 left-0");
      expect(tr).toContain("top-0 right-0 scale-x-[-1]");
      expect(bl).toContain("bottom-0 left-0 scale-y-[-1]");
      expect(br).toContain("bottom-0 right-0 scale-[-1]");

      // Accessibility check
      expect(tl).toContain('aria-hidden="true"');
      expect(tl).toContain("pointer-events-none");
    });

    it("supports custom size prop", () => {
      const html = renderToStaticMarkup(<TazhibCorner size={36} />);
      expect(html).toContain('width="36"');
      expect(html).toContain('height="36"');
    });
  });

  describe("RamadanPillBadge (AC-05)", () => {
    it("renders readable text with high contrast and decorative crescent", () => {
      const html = renderToStaticMarkup(
        <RamadanPillBadge text="Bulan Suci Ramadan" subtext="Syahrul Mubarak" />
      );
      expect(html).toContain("Bulan Suci Ramadan");
      expect(html).toContain("Syahrul Mubarak");
      expect(html).toContain('aria-hidden="true"'); // crescent icon is marked aria-hidden
      expect(html).toContain("text-amber-800");
      expect(html).toContain("dark:text-amber-300");
    });
  });
});
