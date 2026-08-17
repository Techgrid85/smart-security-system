import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
          <SearchX size={38} />
        </div>

        {/* 404 */}
        <h1 className="mt-6 text-7xl font-extrabold tracking-tight text-slate-900">
          404
        </h1>

        <h2 className="mt-3 text-xl font-bold text-slate-800">
          Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
          Sorry, the page you are looking for does not exist or may have been moved.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
          >
            <Home size={17} />
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default NotFound;