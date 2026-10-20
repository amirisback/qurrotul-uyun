import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kitab Qurrotul Uyun & Penulis — Panduan Fiqih Pernikahan",
  description: "Sejarah dan latar belakang Kitab Qurrotul 'Uyun bi Syarhi Nadzam Ibni Yamun karya Syekh Muhammad al-Tihami ibn al-Madani Kanun al-Idrisi al-Hasani.",
};

export default function TentangPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center p-2.5">
            <Image
              src="/logo.svg"
              alt="Logo Qurrotul Uyun"
              width={32}
              height={32}
              className="w-full h-auto text-primary"
            />
          </div>
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Mahakarya Fiqih Munakahat
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Tentang Kitab Qurrotul &lsquo;Uyun
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
          <em>Qurrotul &lsquo;Uyun bi Syarhi Nadzam Ibni Yamun</em> (قرة العيون بشرح نظم ابن يامون) adalah kitab rujukan terkemuka di berbagai pondok pesantren nusantara dan dunia Islam seputar adab berumah tangga.
        </p>
      </div>

      {/* Profil Pengarang & Matan */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          Penulis & Pensyarah Kitab
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed">
          <p>
            Kitab ini merupakan syarah (penjelasan luas) yang ditulis oleh seorang ulama besar dari Maroko (Fes), yaitu <strong>Syekh Muhammad al-Tihami ibn al-Madani Kanun al-Idrisi al-Hasani</strong> (wafat 1331 H / 1913 M). Beliau adalah seorang faqih, muhaddits, dan sufi yang menisbatkan nasab mulianya kepada Rasulullah SAW melalui jalur Sayyidina Idris dan Sayyidina Hasan bin Ali RA.
          </p>
          <p>
            Teks aslinya berupa nadzam (syair puitis edukatif) yang digubah oleh <strong>Syekh Qasim bin Ahmad bin Musa Ibni Yamun al-Tilimsani</strong> (wafat 1010 H). Nadzam Ibni Yamun memuat bait-bait nasihat pernikahan yang sangat mudah dihafal dan diamalkan oleh para santri dan penuntut ilmu.
          </p>
        </div>
      </div>

      {/* Makna Nama Kitab */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          Makna Nama &ldquo;Qurrotul &lsquo;Uyun&rdquo;
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed">
          <p>
            Kata <em>Qurrotul &lsquo;Uyun</em> secara harfiah bermakna <strong>&ldquo;Penyejuk Pandangan Mata&rdquo;</strong> atau <strong>&ldquo;Penenang Jiwa&rdquo;</strong>. Istilah ini dipetik dari doa agung dalam Al-Qur&apos;an Surat Al-Furqan ayat 74:
          </p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center space-y-2">
            <p className="font-arabic text-xl text-foreground">
              رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
            </p>
            <p className="text-xs text-muted-foreground italic">
              &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyejuk hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.&rdquo;
            </p>
          </div>
          <p>
            Tujuan utama pernikahan dalam Islam bukan semata melampiaskan hasrat biologis, melainkan untuk melahirkan ketenangan batin (sakinah), rasa saling mengasihi yang tulus (mawaddah), dan kasih sayang yang mendalam (rahmah).
          </p>
        </div>
      </div>

      {/* Adab Mempelajari Kitab */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          Adab Mempelajari Kitab Fiqih Pernikahan
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 leading-relaxed list-disc list-inside">
          <li>
            <strong>Ikhlas karena Allah:</strong> Berniat menuntut ilmu untuk menjaga diri dari perbuatan yang diharamkan dan menghidupkan sunnah Rasulullah SAW.
          </li>
          <li>
            <strong>Menghindari Sikap Mengolok-olok:</strong> Membaca penjelasan mengenai organ intim dan adab jima&apos; sebagai ilmu syariat yang suci, bukan sebagai lelucon atau pornografi.
          </li>
          <li>
            <strong>Mengamalkan dengan Lemah Lembut:</strong> Mengedepankan keridhaan dan kenyamanan pasangan, bukan pemaksaan kehendak sepihak.
          </li>
        </ul>
      </div>

      {/* Disclaimer Penggunaan */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-2 text-xs text-amber-900 dark:text-amber-200">
        <h3 className="font-bold text-sm flex items-center gap-1.5">
          <span>⚠️</span>
          <span>Disclaimer Pembaca Dewasa</span>
        </h3>
        <p className="leading-relaxed">
          Aplikasi dan materi di dalam website ini ditujukan bagi pasangan suami istri dan calon pengantin usia dewasa (di atas batas usia pernikahan resmi). Seluruh muatan disajikan dengan pendekatan fiqih Islam dan etika ketimuran yang santun.
        </p>
      </div>

      {/* CTA Bottom */}
      <div className="pt-2 text-center">
        <Link
          href="/kitab"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-xs"
        >
          <span>Mulai Membaca 20 Bab Kitab Sekarang</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
