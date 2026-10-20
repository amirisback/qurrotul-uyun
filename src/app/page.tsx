import Link from "next/link";
import { getAllBab } from "@/lib/kitab-data";
import { isRamadanSeason } from "@/lib/calendar-engine";
import {
  IslamicDivider,
  RamadanHilal,
  RamadanFanous,
  RamadanPillBadge,
  TazhibCorner,
  RubElHizb,
} from "@/app/_components/islamic-ornaments";

interface HomePageProps {
  searchParams?: Promise<{
    ramadan?: string;
  }>;
}

export default async function HomePage(props: HomePageProps) {
  const allBab = getAllBab();
  const featuredBab = allBab.slice(0, 6);

  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const isRamadhan =
    searchParams?.ramadan === "true" || searchParams?.ramadan === "1"
      ? true
      : searchParams?.ramadan === "false" || searchParams?.ramadan === "0"
        ? false
        : isRamadanSeason();

  const pillars = [
    {
      title: "Malam Pertama",
      subtitle: "Adab Awal Pernikahan",
      desc: "Tata cara shalat sunnah berdua, mencuci kaki istri, mendoakan ubun-ubun, dan kelembutan awal.",
      href: "/kitab?bab=5",
      badge: "Bab 5",
      color: "from-emerald-900/10 to-emerald-600/5",
      borderColor: "hover:border-primary/50",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      title: "Adab Bersenggama",
      subtitle: "Tata Cara & Foreplay",
      desc: "Etika cumbu rayu romantis (mula'abah), menjaga rasa malu, dan variasi posisi yang dihalalkan.",
      href: "/kitab?bab=6",
      badge: "Bab 6 & 7",
      color: "from-amber-900/10 to-amber-600/5",
      borderColor: "hover:border-accent/50",
      icon: (
        <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: "Kumpulan Doa",
      subtitle: "Doa Mustajab Lengkap",
      desc: "13 doa pilihan dari mencari jodoh, malam pertama, sebelum & sesudah jima', hingga doa keturunan.",
      href: "/doa",
      badge: "13 Doa",
      color: "from-teal-900/10 to-teal-600/5",
      borderColor: "hover:border-teal-500/50",
      icon: (
        <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
    },
    {
      title: "Waktu Utama Jima'",
      subtitle: "Panduan Kalender Syar'i",
      desc: "Hari yang sangat dianjurkan (Senin, Kamis, Malam Jumat) serta waktu-waktu yang dimakruhkan.",
      href: "/panduan-waktu",
      badge: "Kalender",
      color: "from-emerald-900/10 to-emerald-600/5",
      borderColor: "hover:border-primary/50",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-10 md:space-y-14 pb-12">
      {/* Hero Section with Ramadan & Islamic Ornaments */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-12 md:pt-14 md:pb-16 border-b border-border/60">
        {/* Soft Golden Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient Ramadan Hilal (Right Side) - Seasonal in Ramadan */}
        {isRamadhan && (
          <div className="absolute -right-6 md:right-4 -top-6 md:-top-4 w-32 h-32 md:w-52 md:h-52 text-accent/20 dark:text-accent/25 pointer-events-none select-none">
            <RamadanHilal className="w-full h-full" />
          </div>
        )}

        {/* Ambient Hanging Ramadan Fanous 1 (Left Side) - Seasonal in Ramadan */}
        {isRamadhan && (
          <div className="absolute left-3 md:left-12 -top-2 md:-top-3 w-12 md:w-16 h-32 md:h-44 text-accent/25 dark:text-accent/30 pointer-events-none select-none animate-lantern-sway">
            <RamadanFanous className="w-full h-full" cordLength={35} />
          </div>
        )}

        {/* Ambient Hanging Ramadan Fanous 2 (Left-Center) - Seasonal in Ramadan */}
        {isRamadhan && (
          <div className="hidden sm:block absolute left-16 md:left-32 -top-6 md:-top-8 w-9 md:w-12 h-24 md:h-36 text-accent/15 dark:text-accent/20 pointer-events-none select-none">
            <RamadanFanous className="w-full h-full" cordLength={50} />
          </div>
        )}

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Top Badges (Ramadan + Kitab Syarah) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {isRamadhan && <RamadanPillBadge />}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide backdrop-blur-xs">
                <span>📖 Syarah Nadzam Ibni Yamun</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>20 Bab Lengkap</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Panduan Membina Rumah Tangga Sakinah & Adab Pernikahan Islami
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Disarikan dari kitab klasik fiqih perkawinan Islam karya Syekh Muhammad al-Tihami al-Kanun. Membahas adab malam pertama, tata cara jima&apos;, hak kewajiban, dan doa-doa mustajab.
              </p>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/kitab"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Mulai Baca Kitab (20 Bab)
              </Link>
              <Link
                href="/doa"
                className="px-6 py-3 rounded-xl bg-card hover:bg-muted border border-border text-foreground font-semibold text-sm sm:text-base shadow-xs transition-all duration-200"
              >
                Jelajahi Kumpulan Doa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Islamic Section Divider */}
      <IslamicDivider />

      {/* 4 Pilar Menu Utama */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Pilar Pembahasan Utama
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Topik paling dicari seputar malam pertama, etika hubungan suami istri, dan doa keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className={`relative group p-5 rounded-2xl border border-border/80 bg-card ${pillar.borderColor} transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden`}
            >
              {/* Tazhib Corner Illumination */}
              <TazhibCorner position="top-left" size={24} />
              <TazhibCorner position="bottom-right" size={24} />

              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="p-2.5 rounded-xl bg-muted/80 group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors relative z-10">
                  {pillar.title}
                </h3>
                <p className="text-xs text-primary/80 font-medium mt-0.5 relative z-10">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed relative z-10">
                  {pillar.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform relative z-10">
                <span>Pelajari Selengkapnya</span>
                <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Decorative Islamic Section Divider */}
      <IslamicDivider />

      {/* Fitur Baru: Siklus Haid & Masa Subur Islami */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-card to-background p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-widest bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-full">
              <span>🩸</span>
              <span>Fitur Baru Fiqih Wanita</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Pelacak Siklus Haid &amp; Masa Subur Islami Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Kalkulasi status ibadah harian sesuai Mazhab Syafi&apos;i (Haid, Suci, Istihadlah), panduan verifikasi mandi wajib (ghusl), prediksi hari ovulasi puncak, dan pencatatan qadha puasa Ramadhan. 100% data tersimpan lokal di perangkat Anda.
            </p>
          </div>
          <Link
            href="/siklus-haid"
            className="shrink-0 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-sm"
          >
            Buka Pelacak Siklus &rarr;
          </Link>
        </div>
      </section>

      {/* Decorative Islamic Section Divider */}
      <IslamicDivider />

      {/* Untaian Hadits Hari Ini (Framed with Full Tazhib Corners & Watermark) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-card to-primary/5 p-6 md:p-8 shadow-sm">
          {/* 4 Tazhib Corner Brackets */}
          <TazhibCorner position="top-left" size={36} className="text-accent/50 dark:text-accent/70" />
          <TazhibCorner position="top-right" size={36} className="text-accent/50 dark:text-accent/70" />
          <TazhibCorner position="bottom-left" size={36} className="text-accent/50 dark:text-accent/70" />
          <TazhibCorner position="bottom-right" size={36} className="text-accent/50 dark:text-accent/70" />

          {/* Background Rub el Hizb Giant Rosette Watermark */}
          <div className="absolute -right-8 -bottom-8 pointer-events-none select-none text-accent/10 dark:text-accent/15">
            <RubElHizb size="xl" className="w-48 h-48" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-widest bg-accent/15 border border-accent/30 px-3 py-1 rounded-full">
                <span>✨</span>
                <span>Untaian Hadits & Fadhilah</span>
              </span>
              <p className="font-arabic text-xl md:text-2xl text-foreground text-right md:text-left leading-loose">
                خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground italic">
                &ldquo;Sebaik-baik kalian adalah yang paling baik terhadap keluarganya (istrinya), dan aku adalah orang yang paling baik terhadap keluargaku.&rdquo;
              </p>
              <p className="text-xs text-foreground/80 font-semibold">
                — HR. Tirmidzi & Ibnu Majah dari Sayyidah Aisyah RA
              </p>
            </div>
            <Link
              href="/kitab?bab=11"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-xs"
            >
              Baca Bab Kewajiban Suami →
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Islamic Section Divider */}
      <IslamicDivider />

      {/* Daftar Bab Pilihan */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Daftar Bab Kitab Qurrotul Uyun
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pilih bab untuk mulai membaca syarah dan nadzam lengkap.
            </p>
          </div>
          <Link
            href="/kitab"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline hidden sm:inline"
          >
            Lihat Semua 20 Bab →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBab.map((bab) => (
            <Link
              key={bab.id}
              href={`/kitab?bab=${bab.id}`}
              className="relative p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 group flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Corner Touch */}
              <TazhibCorner
                position="top-right"
                size={20}
                className="text-primary/20 group-hover:text-primary/60 transition-colors"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-mono font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    {bab.nomor}
                  </span>
                  <span className="capitalize">{bab.kategori}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">
                  {bab.judul}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {bab.deskripsiRingkas}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-border/40 text-xs text-primary font-medium flex items-center justify-between relative z-10">
                <span>{bab.konten.length} Pasal / Bahasan</span>
                <span>Baca →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/kitab"
            className="inline-block w-full py-3 rounded-xl border border-border bg-card font-semibold text-xs text-foreground"
          >
            Lihat Semua 20 Bab Kitab →
          </Link>
        </div>
      </section>
    </div>
  );
}
