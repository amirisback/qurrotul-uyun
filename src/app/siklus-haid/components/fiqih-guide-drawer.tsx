"use client";

import { useState } from "react";

interface FiqihGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMandiWajib?: () => void;
}

export function FiqihGuideDrawer({
  isOpen,
  onClose,
  onConfirmMandiWajib,
}: FiqihGuideDrawerProps) {
  const [activeTab, setActiveTab] = useState<"tuntas" | "mandi" | "istihadlah" | "adab">("mandi");

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fiqih-guide-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-transform animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 id="fiqih-guide-title" className="text-lg font-bold text-foreground">
              Panduan Fiqih Thaharah &amp; Bersuci
            </h2>
            <p className="text-xs text-muted-foreground">
              Standar Mazhab Syafi&apos;i &amp; Tuntunan Kitab Qurrotul Uyun
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Panduan"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div
          role="tablist"
          aria-label="Pilihan Panduan Fiqih"
          className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-border overflow-x-auto scrollbar-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "mandi"}
            onClick={() => setActiveTab("mandi")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "mandi"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            💧 Niat &amp; Mandi Wajib
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tuntas"}
            onClick={() => setActiveTab("tuntas")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "tuntas"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚪ Tanda Tuntas Haid
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "istihadlah"}
            onClick={() => setActiveTab("istihadlah")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "istihadlah"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚠️ Istihadlah &amp; Wudhu
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "adab"}
            onClick={() => setActiveTab("adab")}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "adab"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            📜 Adab Ba&apos;da Suci
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-foreground text-xs sm:text-sm leading-relaxed">
          {activeTab === "mandi" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Niat Mandi */}
              <div className="p-4 md:p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Niat Mandi Wajib Setelah Haid (Ghusl)
                </span>
                <p className="font-arabic text-xl md:text-2xl text-foreground text-right leading-loose">
                  نَوَيْتُ الْغُسْلَ لِرَفْعِ حَدَثِ الْحَيْضِ فَرْضًا لِلَّهِ تَعَالَى
                </p>
                <p className="italic text-muted-foreground">
                  &ldquo;Nawaitul ghusla li raf&apos;i hadatsil haidhi fardhan lillaahi ta&apos;ala.&rdquo;
                </p>
                <p className="text-foreground font-medium">
                  &ldquo;Aku berniat mandi untuk menghilangkan hadats besar haid fardhu karena Allah Ta&apos;ala.&rdquo;
                </p>
              </div>

              {/* Rukun Mandi Wajib */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">
                  Dua Rukun Wajib Mandi (Mazhab Syafi&apos;i):
                </h3>
                <ol className="space-y-2 pl-4 list-decimal text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Membaca Niat:</strong> Dihadirkan di dalam hati berbarengan saat air pertama kali menyentuh bagian tubuh mana saja.
                  </li>
                  <li>
                    <strong className="text-foreground">Meratakan Air ke Seluruh Tubuh:</strong> Air suci mensucikan wajib mengenai seluruh kulit luar dan seluruh helai rambut hingga ke akar/pangkalnya tanpa terlewat sedikitpun.
                  </li>
                </ol>
              </div>

              {/* Sunnah-Sunnah */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">
                  Sunnah-Sunnah Mandi Wajib:
                </h3>
                <ul className="space-y-1.5 pl-4 list-disc text-muted-foreground">
                  <li>Membaca Basmalah dan mencuci kedua telapak tangan 3 kali.</li>
                  <li>Membersihkan kotoran dan najis pada kemaluan terlebih dahulu.</li>
                  <li>Berwudhu sempurna sebagaimana wudhu shalat sebelum menyiram tubuh.</li>
                  <li>Menyela-nyela pangkal rambut kepala dengan jari jemari basah.</li>
                  <li>Mendahulukan anggota tubuh bagian kanan, baru kemudian bagian kiri.</li>
                  <li>Mengusapkan kapas berwewangian (misk / kasturi) pada tempat keluarnya darah untuk menghilangkan aroma bekas darah (Sunnah Shahihah).</li>
                </ul>
              </div>

              {onConfirmMandiWajib && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onConfirmMandiWajib();
                      onClose();
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Saya Sudah Selesai Melaksanakan Mandi Wajib
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "tuntas" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-foreground">
                Dua Tanda Sah Berhentinya Darah Haid:
              </h3>
              <p className="text-muted-foreground">
                Para ulama fiqih menjelaskan bahwa tanda berakhirnya haid ditandai oleh salah satu dari dua fenomena berikut:
              </p>

              <div className="p-4 rounded-2xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 space-y-2">
                <h4 className="font-bold text-sky-800 dark:text-sky-200">
                  1. Qashshah Baidha&apos; (الْقَصَّةُ الْبَيْضَاءُ)
                </h4>
                <p className="text-foreground/90">
                  Keluarnya cairan putih bening serupa getah kapur atau putih telur dari rahim pada akhir masa haid. Ini adalah tanda tuntas paling kuat.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Sayyidah Aisyah r.a. berkata kepada para wanita: &ldquo;Janganlah kalian tergesa-gesa mandi sampai kalian melihat al-qashshah al-baidha&apos;.&rdquo; (Atsar Riwayat Bukhari).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 space-y-2">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-200">
                  2. Jufuf / Naqa&apos; (الْجُفُوفُ)
                </h4>
                <p className="text-foreground/90">
                  Keringnya rahim, yaitu ketika dimasukkan kapas putih bersih ke dalam farji, kapas tersebut keluar dalam keadaan kering tanpa noda darah, warna coklat keruh (kudrah), maupun kuning (shufrah).
                </p>
              </div>
            </div>
          )}

          {activeTab === "istihadlah" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-foreground">
                Kaidah Darah Istihadlah (Darah Penyakit):
              </h3>
              <p className="text-muted-foreground">
                Istihadlah adalah pendarahan yang keluar dari pembuluh darah yang pecah di bawah rahim (*&apos;adzil*), bukan darah alami haid. Terjadi jika:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-muted-foreground">
                <li>Darah keluar kurang dari 24 jam akumulatif dalam masa 15 hari.</li>
                <li>Darah terus keluar melebihi batas maksimal haid yaitu 15 hari 15 malam.</li>
                <li>Darah keluar kembali sebelum genap 15 hari masa suci dari haid sebelumnya.</li>
              </ul>

              <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 space-y-2">
                <h4 className="font-bold text-amber-800 dark:text-amber-200">
                  Hukum &amp; Tata Cara Ibadah Wanita Mustahadhah:
                </h4>
                <ul className="space-y-1 text-xs text-foreground/90 list-disc pl-4">
                  <li><strong>Wajib Shalat &amp; Puasa:</strong> Tidak boleh meninggalkan shalat fardhu dan puasa Ramadhan.</li>
                  <li><strong>Mandi Sekali:</strong> Hanya wajib mandi satu kali di awal ketika batas haid berakhir.</li>
                  <li><strong>Tata Cara Wudhu:</strong> Setiap kali masuk waktu shalat fardhu, bersihkan kemaluan, sumbat/balut dengan pembalut rapat, lalu segera berwudhu dan mendirikan shalat (1 wudhu = 1 shalat fardhu).</li>
                  <li><strong>Hubungan Intim:</strong> Menurut pendapat mu&apos;tamad Mazhab Syafi&apos;i, halal berhubungan suami-istri jika ada hajat.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "adab" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-foreground">
                Adab Berhubungan Intim Ba&apos;da Bersuci (Kitab Qurrotul Uyun):
              </h3>
              <p className="text-muted-foreground">
                Kitab Qurrotul Uyun Bab 3 dan 6 menjelaskan beberapa tuntunan luhur setelah istri suci:
              </p>
              <ol className="space-y-2 pl-4 list-decimal text-muted-foreground">
                <li>
                  <strong className="text-foreground">Kepastian Mandi Junub:</strong> Tidak diperkenankan senggama sebelum istri selesai mandi wajib secara sah, meskipun darah sudah berhenti.
                </li>
                <li>
                  <strong className="text-foreground">Menjaga Kebersihan &amp; Wewangian:</strong> Disunnahkan memakai wewangian dan menyegarkan tubuh agar suasana keintiman membawa sakinah dan cinta kasih.
                </li>
                <li>
                  <strong className="text-foreground">Membaca Doa Perlindungan:</strong> Membaca doa sebelum jima&apos; agar anak yang ditakdirkan lahir terbebas dari marabahaya syaitan.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
