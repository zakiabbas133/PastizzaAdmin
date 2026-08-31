interface DashboardLoaderProps {
  message?: string;
}
export default function DashboardLoader({
  message = "Loading dashboard...",
}: DashboardLoaderProps) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {" "}
      {/* ================================================================ BLURRED BACKDROP ================================================================= */}{" "}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl dark:bg-gray-950/75" />{" "}
      {/* Soft ambient background */}{" "}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {" "}
        <div className="absolute left-[20%] top-[20%] h-72 w-72 animate-pulse rounded-full bg-brand-500/10 blur-3xl" />{" "}
        <div
          className="absolute bottom-[15%] right-[15%] h-80 w-80 animate-pulse rounded-full bg-blue-500/10 blur-3xl"
          style={{ animationDelay: "700ms" }}
        />{" "}
      </div>{" "}
      {/* ================================================================ LOADER CARD ================================================================= */}{" "}
      <div className="relative z-10 flex flex-col items-center">
        {" "}
        {/* Animated SVG Loader */}{" "}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {" "}
          {/* Outer rotating dashed ring */}{" "}
          <svg
            className="absolute inset-0 h-full w-full animate-[spin_8s_linear_infinite]"
            viewBox="0 0 128 128"
            fill="none"
          >
            {" "}
            <circle
              cx="64"
              cy="64"
              r="57"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              className="text-brand-500/20"
            />{" "}
          </svg>{" "}
          {/* Main animated ring */}{" "}
          <svg
            className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] -rotate-90 animate-[spin_3s_linear_infinite]"
            viewBox="0 0 120 120"
            fill="none"
          >
            {" "}
            <defs>
              {" "}
              <linearGradient
                id="loaderGradient"
                x1="0"
                y1="0"
                x2="120"
                y2="120"
              >
                {" "}
                <stop offset="0%" stopColor="currentColor" />{" "}
                <stop
                  offset="50%"
                  stopColor="currentColor"
                  stopOpacity="0.15"
                />{" "}
                <stop offset="100%" stopColor="currentColor" />{" "}
              </linearGradient>{" "}
            </defs>{" "}
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="210 100"
              className="text-brand-500"
            />{" "}
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="url(#loaderGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="40 270"
              className="text-brand-300"
            />{" "}
          </svg>{" "}
          {/* Inner glow */}{" "}
          <div className="absolute h-20 w-20 animate-pulse rounded-full bg-brand-500/10 blur-xl" />{" "}
          {/* Dashboard icon */}{" "}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 bg-white/80 shadow-xl shadow-brand-500/10 backdrop-blur-md dark:border-gray-700/70 dark:bg-gray-900/80">
            {" "}
            <svg
              viewBox="0 0 48 48"
              className="h-9 w-9 text-brand-500"
              fill="none"
            >
              {" "}
              {/* Window */}{" "}
              <rect
                x="7"
                y="8"
                width="34"
                height="32"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
              />{" "}
              {/* Header */}{" "}
              <path d="M7 17H41" stroke="currentColor" strokeWidth="2" />{" "}
              {/* Header dots */}{" "}
              <circle cx="13" cy="12.5" r="1.3" fill="currentColor" />{" "}
              <circle cx="18" cy="12.5" r="1.3" fill="currentColor" />{" "}
              <circle cx="23" cy="12.5" r="1.3" fill="currentColor" />{" "}
              {/* Dashboard cards */}{" "}
              <rect
                x="12"
                y="22"
                width="9"
                height="6"
                rx="1.5"
                fill="currentColor"
                opacity="0.25"
              />{" "}
              <rect
                x="25"
                y="22"
                width="11"
                height="6"
                rx="1.5"
                fill="currentColor"
                opacity="0.45"
              />{" "}
              {/* Chart */}{" "}
              <path
                d="M13 35L18 31L23 33L29 27L35 30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              {/* Animated chart point */}{" "}
              <circle
                cx="35"
                cy="30"
                r="2"
                fill="currentColor"
                className="animate-pulse"
              />{" "}
            </svg>{" "}
          </div>{" "}
          {/* Floating particles */}{" "}
          <span
            className="absolute -right-1 top-7 h-2 w-2 animate-bounce rounded-full bg-brand-500/60"
            style={{ animationDelay: "200ms" }}
          />{" "}
          <span
            className="absolute bottom-5 -left-1 h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500/50"
            style={{ animationDelay: "600ms" }}
          />{" "}
          <span
            className="absolute -left-3 top-12 h-1 w-1 animate-pulse rounded-full bg-brand-400"
            style={{ animationDelay: "900ms" }}
          />{" "}
        </div>{" "}
        {/* ================================================================ TEXT ================================================================= */}{" "}
        <div className="mt-7 text-center">
          {" "}
          <h2 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-white">
            {" "}
            {message}{" "}
          </h2>{" "}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {" "}
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500"
              style={{ animationDelay: "0ms" }}
            />{" "}
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500"
              style={{ animationDelay: "150ms" }}
            />{" "}
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500"
              style={{ animationDelay: "300ms" }}
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* ================================================================ PROGRESS LINE ================================================================= */}{" "}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-gray-200/70 dark:bg-gray-800">
          {" "}
          <div className="h-full w-1/2 animate-[loader_1.5s_ease-in-out_infinite] rounded-full bg-brand-500" />{" "}
        </div>{" "}
      </div>{" "}
      {/* ================================================================ ANIMATIONS ================================================================= */}{" "}
      <style>{` @keyframes loader { 0% { transform: translateX(-120%); } 50% { transform: translateX(100%); } 100% { transform: translateX(240%); } } `}</style>{" "}
    </div>
  );
}
