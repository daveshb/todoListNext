"use client";

import { useState } from "react";
import { generarBorradorBlog } from "@/services/ai";

export default function AiWriterPage() {
  const [titulo, setTitulo] = useState("");
  const [borrador, setBorrador] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const generar = async () => {
    if (!titulo.trim()) return;

    setCargando(true);
    setBorrador("");
    setError("");

    try {
      const texto = await generarBorradorBlog(titulo);
      setBorrador(texto);
    } catch {
      setError("No se pudo conectar con la IA. Verifica que OPEN_AI esté configurado.");
    } finally {
      setCargando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(borrador);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <span className="inline-block bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            IA · Streaming · OpenAI
          </span>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Asistente de Escritura
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base">
            Escribe un título y la IA genera un borrador completo en markdown — en tiempo real.
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ej: 10 razones para aprender TypeScript en 2025"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !cargando && generar()}
            disabled={cargando}
            className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
          />
          <button
            onClick={generar}
            disabled={cargando || !titulo.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {cargando ? "Generando..." : "Generar"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loader */}
        {cargando && (
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
            <svg className="animate-spin h-5 w-5 text-violet-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Generando borrador…</span>
          </div>
        )}

        {/* Resultado completo */}
        {borrador && (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Borrador generado
              </span>
              <button
                onClick={copiar}
                className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium"
              >
                Copiar markdown
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {borrador}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
