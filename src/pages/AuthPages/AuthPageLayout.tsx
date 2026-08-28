import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffdf8] dark:bg-gray-950">
      {/* =========================================================
          GLOBAL BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large ambient blobs */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#eebe45]/10 blur-[100px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#eebe45]/10 blur-[100px]" />

        {/* Decorative dots */}
        <div className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-[#eebe45]/50 animate-login-pulse" />

        <div className="absolute left-[42%] top-[12%] h-1.5 w-1.5 rounded-full bg-[#eebe45]/40 animate-login-float-1" />

        <div className="absolute right-[8%] top-[30%] h-2 w-2 rounded-full bg-[#eebe45]/40 animate-login-pulse" />

        <div className="absolute bottom-[15%] left-[35%] h-1.5 w-1.5 rounded-full bg-[#eebe45]/50 animate-login-float-2" />
      </div>

      {/* =========================================================
          MAIN
      ========================================================== */}

      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        {/* =======================================================
            LEFT - LOGIN
        ======================================================== */}

        <div className="relative flex min-h-screen w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[46%] lg:px-16">
          {/* Login glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eebe45]/5 blur-[100px]" />

          <div className="relative z-20 w-full max-w-md animate-login-form">
            {children}
          </div>
        </div>

        {/* =======================================================
            RIGHT - DASHBOARD ILLUSTRATION
        ======================================================== */}

        <div className="relative hidden min-h-screen w-full overflow-hidden bg-[#f8f3e8] lg:flex lg:w-[54%] dark:bg-gray-900">
          {/* =====================================================
              BACKGROUND GRID
          ====================================================== */}

          <svg
            className="absolute inset-0 h-full w-full opacity-[0.35]"
            viewBox="0 0 900 900"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="dashboard-grid"
                width="45"
                height="45"
                patternUnits="userSpaceOnUse"
              >
                <path d="M45 0H0V45" stroke="#d9cfae" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="900" height="900" fill="url(#dashboard-grid)" />
          </svg>

          {/* =====================================================
              DECORATIVE ORBITS
          ====================================================== */}

          <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#eebe45]/15 animate-dashboard-orbit" />

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#eebe45]/10 animate-dashboard-orbit-reverse" />

          {/* Orbit dots */}
          <div className="absolute left-1/2 top-[10%] h-3 w-3 rounded-full bg-[#eebe45] shadow-[0_0_25px_rgba(238,190,69,0.7)] animate-dashboard-dot" />

          <div className="absolute bottom-[14%] right-[14%] h-2 w-2 rounded-full bg-[#d49f16] animate-login-pulse" />

          {/* =====================================================
              MAIN DASHBOARD WINDOW
          ====================================================== */}

          <div className="relative z-10 m-auto h-[590px] w-[680px] animate-dashboard-enter">
            {/* Dashboard shadow */}
            <div className="absolute inset-10 rounded-[28px] bg-[#b9a56e]/20 blur-[45px]" />

            {/* Dashboard */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(80,60,20,0.15)] dark:border-white/10 dark:bg-gray-900">
              {/* =================================================
                  DASHBOARD HEADER
              ================================================== */}

              <div className="flex h-[62px] items-center justify-between border-b border-gray-100 px-6 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  {/* Logo */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eebe45] shadow-sm">
                    <span className="font-black text-gray-900">P</span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-800 dark:text-white">
                      PASTIZZA
                    </div>

                    <div className="text-[9px] text-gray-400">ADMIN PANEL</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-2 w-20 rounded-full bg-gray-100 dark:bg-gray-800" />

                  <div className="h-8 w-8 rounded-full bg-[#f4e8c5]" />
                </div>
              </div>

              {/* =================================================
                  DASHBOARD BODY
              ================================================== */}

              <div className="flex h-[calc(100%-62px)]">
                {/* Sidebar */}
                <div className="hidden w-[145px] border-r border-gray-100 p-4 sm:block dark:border-gray-800">
                  <div className="mb-5 h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />

                  <DashboardNav active width="85%" />

                  <DashboardNav width="70%" />

                  <DashboardNav width="80%" />

                  <DashboardNav width="60%" />

                  <DashboardNav width="75%" />

                  <div className="mt-10 h-px bg-gray-100 dark:bg-gray-800" />

                  <DashboardNav width="65%" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#fcfcfa] p-5 dark:bg-gray-950">
                  {/* Page title */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="h-4 w-28 rounded bg-gray-800/90 dark:bg-white/90" />

                      <div className="mt-2 h-2 w-36 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>

                    <div className="h-8 w-20 rounded-lg bg-[#eebe45]/20" />
                  </div>

                  {/* =================================================
                      STAT CARDS
                  ================================================== */}

                  <div className="grid grid-cols-3 gap-3">
                    <DashboardStat title="Orders" value="248" icon="orders" />

                    <DashboardStat
                      title="Revenue"
                      value="$8.4K"
                      icon="revenue"
                    />

                    <DashboardStat title="Items" value="42" icon="items" />
                  </div>

                  {/* =================================================
                      CHART + ORDERS
                  ================================================== */}

                  <div className="mt-4 grid grid-cols-[1.4fr_0.8fr] gap-3">
                    {/* Chart */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-2.5 w-24 rounded bg-gray-800 dark:bg-white" />

                          <div className="mt-2 h-2 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>

                        <div className="h-6 w-14 rounded-md bg-gray-50 dark:bg-gray-800" />
                      </div>

                      {/* SVG Chart */}
                      <svg
                        viewBox="0 0 300 130"
                        className="mt-5 h-[125px] w-full"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0"
                              stopColor="#eebe45"
                              stopOpacity="0.25"
                            />

                            <stop
                              offset="1"
                              stopColor="#eebe45"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>

                        {/* Area */}
                        <path
                          d="M0 100 C25 90 35 85 55 92 C80 101 92 70 115 75 C140 82 150 55 170 63 C195 74 210 38 230 48 C250 57 265 25 300 32 V130 H0 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Line */}
                        <path
                          d="M0 100 C25 90 35 85 55 92 C80 101 92 70 115 75 C140 82 150 55 170 63 C195 74 210 38 230 48 C250 57 265 25 300 32"
                          stroke="#eebe45"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        {/* Dots */}
                        <circle cx="170" cy="63" r="4" fill="#eebe45" />

                        <circle cx="230" cy="48" r="4" fill="#eebe45" />

                        <circle cx="300" cy="32" r="5" fill="#eebe45" />
                      </svg>

                      <div className="mt-1 flex justify-between">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <span
                              key={day}
                              className="text-[8px] text-gray-400"
                            >
                              {day}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Orders */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="h-2.5 w-20 rounded bg-gray-800 dark:bg-white" />

                        <div className="h-5 w-5 rounded-full bg-[#eebe45]/20" />
                      </div>

                      <MiniOrder name="Margherita" price="$18" />

                      <MiniOrder name="Pepperoni" price="$22" />

                      <MiniOrder name="Truffle" price="$26" />

                      <MiniOrder name="Pesto" price="$19" />
                    </div>
                  </div>

                  {/* =================================================
                      MENU ITEMS
                  ================================================== */}

                  <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-2.5 w-24 rounded bg-gray-800 dark:bg-white" />

                      <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <MenuPreview image="🍕" name="Classic Pizza" />

                      <MenuPreview image="🍝" name="Pasta" />

                      <MenuPreview image="🥗" name="Fresh Salad" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                FLOATING NOTIFICATION
            ====================================================== */}

            <div className="absolute -right-8 top-24 w-[185px] animate-dashboard-card">
              <div className="rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[0_20px_50px_rgba(70,50,10,0.15)] backdrop-blur dark:border-gray-700 dark:bg-gray-800/95">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eebe45]/20 text-lg">
                    ✓
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-gray-800 dark:text-white">
                      New Order
                    </div>

                    <div className="mt-1 text-[9px] text-gray-400">
                      Order #1048 received
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                FLOATING REVENUE CARD
            ====================================================== */}

            <div className="absolute -bottom-6 -left-8 w-[175px] animate-dashboard-card-reverse">
              <div className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_20px_50px_rgba(70,50,10,0.15)] backdrop-blur dark:border-gray-700 dark:bg-gray-800/95">
                <div className="text-[9px] font-medium text-gray-400">
                  Today's Revenue
                </div>

                <div className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  $2,840
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    +18.4%
                  </span>

                  <span className="text-[8px] text-gray-400">vs yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          THEME TOGGLE
      ========================================================== */}

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>

      {/* =========================================================
          ANIMATIONS
      ========================================================== */}

      <style>{`
        @keyframes loginForm {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboardEnter {
          from {
            opacity: 0;
            transform: translateY(35px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes dashboardCard {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes dashboardCardReverse {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(10px);
          }
        }

        @keyframes dashboardOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes dashboardOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes dashboardDot {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(20px);
          }
        }

        @keyframes loginPulse {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes loginFloat1 {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(15px, -20px);
          }
        }

        @keyframes loginFloat2 {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-20px, 15px);
          }
        }

        .animate-login-form {
          animation: loginForm 0.8s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .animate-dashboard-enter {
          animation: dashboardEnter 1s cubic-bezier(0.22, 1, 0.36, 1)
            0.15s both;
        }

        .animate-dashboard-card {
          animation: dashboardCard 5s ease-in-out infinite;
        }

        .animate-dashboard-card-reverse {
          animation: dashboardCardReverse 6s ease-in-out infinite;
        }

        .animate-dashboard-orbit {
          animation: dashboardOrbit 35s linear infinite;
        }

        .animate-dashboard-orbit-reverse {
          animation: dashboardOrbitReverse 25s linear infinite;
        }

        .animate-dashboard-dot {
          animation: dashboardDot 4s ease-in-out infinite;
        }

        .animate-login-pulse {
          animation: loginPulse 3s ease-in-out infinite;
        }

        .animate-login-float-1 {
          animation: loginFloat1 5s ease-in-out infinite;
        }

        .animate-login-float-2 {
          animation: loginFloat2 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-login-form,
          .animate-dashboard-enter,
          .animate-dashboard-card,
          .animate-dashboard-card-reverse,
          .animate-dashboard-orbit,
          .animate-dashboard-orbit-reverse,
          .animate-dashboard-dot,
          .animate-login-pulse,
          .animate-login-float-1,
          .animate-login-float-2 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ===============================================================
   SIDEBAR NAV ITEM
================================================================ */

function DashboardNav({
  width = "70%",
  active = false,
}: {
  width?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 rounded-lg px-2 py-2 ${
        active ? "bg-[#eebe45]/10" : ""
      }`}
    >
      <div
        className={`h-5 w-5 rounded-md ${
          active ? "bg-[#eebe45]" : "bg-gray-100 dark:bg-gray-800"
        }`}
      />

      <div
        className={`h-2 rounded ${
          active ? "bg-[#eebe45]/50" : "bg-gray-100 dark:bg-gray-800"
        }`}
        style={{ width }}
      />
    </div>
  );
}

/* ===============================================================
   STAT CARD
================================================================ */

function DashboardStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: "orders" | "revenue" | "items";
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="text-[8px] text-gray-400">{title}</div>

        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#eebe45]/10">
          {icon === "orders" && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#eebe45"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          )}

          {icon === "revenue" && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#eebe45"
              strokeWidth="2"
            >
              <path d="M12 1v22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
            </svg>
          )}

          {icon === "items" && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#eebe45"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          )}
        </div>
      </div>

      <div className="mt-2 text-base font-bold text-gray-800 dark:text-white">
        {value}
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="h-full w-[70%] rounded-full bg-[#eebe45]" />
      </div>
    </div>
  );
}

/* ===============================================================
   MINI ORDER
================================================================ */

function MiniOrder({ name, price }: { name: string; price: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-[#f6efd9]" />

        <div>
          <div className="text-[8px] font-medium text-gray-700 dark:text-gray-200">
            {name}
          </div>

          <div className="mt-1 h-1.5 w-10 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>

      <div className="text-[8px] font-semibold text-gray-700 dark:text-gray-300">
        {price}
      </div>
    </div>
  );
}

/* ===============================================================
   MENU PREVIEW
================================================================ */

function MenuPreview({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#faf8f2] p-2 dark:bg-gray-800">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4e8c5] text-lg">
        {image}
      </div>

      <div>
        <div className="text-[8px] font-semibold text-gray-700 dark:text-gray-200">
          {name}
        </div>

        <div className="mt-1 h-1.5 w-8 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
