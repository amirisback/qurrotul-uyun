import Link from "next/link";
import Image from "next/image";
import { IslamicDivider } from "./islamic-ornaments";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground text-sm">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Synopsis */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center p-1.5">
                <Image
                  src="/logo.svg"
                  alt="Logo Qurrotul Uyun"
                  width={20}
                  height={20}
                  className="w-full h-auto text-primary"
                />
              </div>
              <span className="font-bold text-foreground text-base tracking-tight">
                Qurrotul Uyun
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              Aplikasi digital panduan fiqih rumah tangga, adab pernikahan, dan seni keharmonisan suami istri yang disarikan dari kitab <em>Qurrotul &lsquo;Uyun bi Syarhi Nadzam Ibni Yamun</em> karya Syekh Muhammad al-Tihami al-Kanun.
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              Disajikan dengan bahasa santun, ilmiah, dan berlandaskan dalil Al-Qur&apos;an dan As-Sunnah.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Daftar Menu
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/kitab" className="hover:text-primary transition-colors">
                  Kitab (20 Bab)
                </Link>
              </li>
              <li>
                <Link href="/doa" className="hover:text-primary transition-colors">
                  Kumpulan Doa
                </Link>
              </li>
              <li>
                <Link href="/panduan-waktu" className="hover:text-primary transition-colors">
                  Waktu & Kalender Jima&apos;
                </Link>
              </li>
              <li>
                <Link href="/favorit" className="hover:text-primary transition-colors">
                  Item Favorit
                </Link>
              </li>
            </ul>
          </div>

          {/* Bab Populer */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Bab Pilihan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/kitab?bab=1" className="hover:text-primary transition-colors">
                  Bab 1: Hukum & Rukun Nikah
                </Link>
              </li>
              <li>
                <Link href="/kitab?bab=5" className="hover:text-primary transition-colors">
                  Bab 5: Adab Malam Pertama
                </Link>
              </li>
              <li>
                <Link href="/kitab?bab=6" className="hover:text-primary transition-colors">
                  Bab 6: Etika Jima&apos; & Foreplay
                </Link>
              </li>
              <li>
                <Link href="/kitab?bab=7" className="hover:text-primary transition-colors">
                  Bab 7: Variasi & Posisi Bersenggama
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-primary transition-colors">
                  Tentang Kitab & Penulis
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Islamic Divider & Disclaimer / Copyright */}
        <IslamicDivider className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-center sm:text-left text-[11px]">
            &copy; {currentYear} Qurrotul Uyun. Edukasi syariat pernikahan Islami untuk pasangan suami istri dan calon pengantin.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>PWA Offline Ready</span>
            <span>•</span>
            <Link href="/tentang" className="hover:text-foreground transition-colors">
              Disclaimer & Referensi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
