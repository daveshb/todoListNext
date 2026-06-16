"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 1 — useCallback
// ─────────────────────────────────────────────────────────────────────────────

// Este hijo está envuelto en memo → solo re-renderiza si sus props cambian.
// Sin useCallback, cada vez que el padre re-renderiza crea una NUEVA función
// aunque la lógica sea idéntica. memo compara referencias, no contenido,
// por eso el hijo re-renderizaría igual. useCallback mantiene la misma
// referencia entre renders y memo puede hacer su trabajo.
const BotonHijo = memo(({ label, onClick }: { label: string; onClick: () => void }) => {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all"
    >
      {label}
      <span className="ml-2 text-indigo-200 text-xs">renders: {renders.current}</span>
    </button>
  );
});
BotonHijo.displayName = "BotonHijo";

const SeccionUseCallback = () => {
  const [contador, setContador] = useState(0);
  const [otroEstado, setOtroEstado] = useState(0);

  // SIN useCallback → nueva referencia en cada render del padre → BotonSin siempre re-renderiza
  const handleSinCallback = () => setContador((c) => c + 1);

  // CON useCallback → misma referencia mientras las deps no cambien → BotonCon no re-renderiza
  const handleConCallback = useCallback(() => setContador((c) => c + 1), []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">useCallback</h2>

      <div className="bg-zinc-800 rounded-xl p-5 space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>
          <span className="text-yellow-400 font-semibold">¿Cuándo usarlo?</span> Cuando pasas una
          función como prop a un componente hijo envuelto en{" "}
          <code className="bg-zinc-700 px-1 rounded">React.memo</code>. Sin{" "}
          <code className="bg-zinc-700 px-1 rounded">useCallback</code>, cada render del padre crea
          una función nueva → memo no puede evitar el re-render del hijo.
        </p>
        <p>
          <span className="text-red-400 font-semibold">¿Cuándo NO usarlo?</span> No lo uses en
          funciones que no se pasan como props, o en componentes sin memo. Agrega complejidad y
          tiene un costo de memoria propio.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Sin useCallback */}
        <div className="bg-zinc-800 rounded-xl p-5 space-y-3">
          <h3 className="text-red-400 font-semibold">Sin useCallback</h3>
          <p className="text-xs text-zinc-400">
            El contador de renders del botón sube cada vez que cambia{" "}
            <em>cualquier</em> estado del padre, aunque la función haga lo mismo.
          </p>
          <BotonHijo label="+1 al contador" onClick={handleSinCallback} />
        </div>

        {/* Con useCallback */}
        <div className="bg-zinc-800 rounded-xl p-5 space-y-3">
          <h3 className="text-green-400 font-semibold">Con useCallback</h3>
          <p className="text-xs text-zinc-400">
            El botón <strong>no</strong> re-renderiza cuando cambia{" "}
            <em>otroEstado</em>. La referencia de la función es estable.
          </p>
          <BotonHijo label="+1 al contador" onClick={handleConCallback} />
        </div>
      </div>

      {/* Control externo para demostrar el punto */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={() => setOtroEstado((o) => o + 1)}
          className="px-4 py-2 rounded bg-zinc-600 text-white text-sm hover:bg-zinc-500 transition-colors"
        >
          Cambiar OTRO estado (sin tocar el contador)
        </button>
        <span className="text-zinc-400 text-sm">
          Contador: <strong className="text-white">{contador}</strong> | Otro estado:{" "}
          <strong className="text-white">{otroEstado}</strong>
        </span>
      </div>

      <p className="text-zinc-500 text-xs">
        Presiona "Cambiar OTRO estado" y observa cómo el botón{" "}
        <span className="text-red-400">Sin useCallback</span> incrementa su render-count mientras el
        botón <span className="text-green-400">Con useCallback</span> no lo hace.
      </p>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2 — useRef: caso A — acceso al DOM
// ─────────────────────────────────────────────────────────────────────────────

const SeccionRefDom = () => {
  // useRef devuelve un objeto { current: ... } que persiste entre renders.
  // Mutarlo NO dispara un re-render (a diferencia de useState).
  // Aquí lo usamos para obtener una referencia directa al input del DOM.
  const inputRef = useRef<HTMLInputElement>(null);
  const [mensaje, setMensaje] = useState("");

  const handleEnfocar = () => {
    // current apunta al <input> real del DOM. Desde aquí puedo llamar
    // cualquier método nativo: focus, blur, select, scroll, etc.
    inputRef.current?.focus();
    setMensaje("¡Input enfocado con useRef!");
  };

  const handleLeer = () => {
    setMensaje(`Valor actual del input: "${inputRef.current?.value}"`);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">useRef — Caso A: acceso al DOM</h2>

      <div className="bg-zinc-800 rounded-xl p-5 text-sm text-zinc-300 leading-relaxed space-y-2">
        <p>
          <span className="text-yellow-400 font-semibold">¿Cuándo usarlo?</span> Cuando necesitas
          manipular un elemento del DOM directamente: enfocarlo, medir su tamaño, disparar animaciones
          imperativas o integrar librerías que no son React.
        </p>
        <p>
          <span className="text-red-400 font-semibold">¿Por qué no useState?</span> Porque no
          necesitas que React re-renderice cuando obtienes la referencia. El ref existe para{" "}
          <em>escapar</em> del flujo reactivo.
        </p>
      </div>

      <div className="bg-zinc-800 rounded-xl p-5 space-y-3">
        <input
          ref={inputRef}            // ← React asigna el nodo DOM a inputRef.current
          type="text"
          placeholder="Escribe algo..."
          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
        />
        <div className="flex gap-3">
          <button
            onClick={handleEnfocar}
            className="px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
          >
            Enfocar input
          </button>
          <button
            onClick={handleLeer}
            className="px-4 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
          >
            Leer valor sin estado
          </button>
        </div>
        {mensaje && (
          <p className="text-emerald-400 text-sm font-medium">{mensaje}</p>
        )}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 3 — useRef: caso B — valor mutable que NO dispara re-render
// ─────────────────────────────────────────────────────────────────────────────

const SeccionRefValor = () => {
  const [renderCount, setRenderCount] = useState(0);

  // Este ref guarda cuántas veces se llamó el intervalo.
  // Cambiarlo NO provoca un re-render, por eso podemos leerlo
  // dentro de un intervalo sin crear dependencias circulares.
  const vecesIntervaloRef = useRef(0);

  // Este ref guarda el ID del intervalo para poder cancelarlo.
  // Si guardáramos el ID en estado, cada setInterval dispararía un render.
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [corriendo, setCorriendo] = useState(false);

  const iniciar = useCallback(() => {
    if (intervalIdRef.current) return;
    setCorriendo(true);
    intervalIdRef.current = setInterval(() => {
      vecesIntervaloRef.current += 1;   // mutación directa, sin setState
      // Solo re-renderizamos para mostrar el render-count externo
      setRenderCount((r) => r + 1);
    }, 500);
  }, []);

  const detener = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setCorriendo(false);
  }, []);

  // Limpieza al desmontar el componente
  useEffect(() => () => { if (intervalIdRef.current) clearInterval(intervalIdRef.current); }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        useRef — Caso B: valor mutable sin re-render
      </h2>

      <div className="bg-zinc-800 rounded-xl p-5 text-sm text-zinc-300 leading-relaxed space-y-2">
        <p>
          <span className="text-yellow-400 font-semibold">¿Cuándo usarlo?</span> Cuando necesitas
          guardar un valor entre renders <em>sin</em> que al cambiarlo se dispare un nuevo render.
          Casos típicos: IDs de timers/intervals, valores anteriores, contadores internos,
          flags de "ya se ejecutó".
        </p>
        <p>
          <span className="text-red-400 font-semibold">¿Por qué no useState?</span> Cada{" "}
          <code className="bg-zinc-700 px-1 rounded">setState</code> programa un re-render. Guardar
          un intervalId en estado provocaría renders innecesarios cada vez que lo asignas o limpias.
        </p>
      </div>

      <div className="bg-zinc-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-zinc-700 rounded-lg p-4 space-y-1">
            <p className="text-zinc-400">Disparos del intervalo</p>
            <p className="text-3xl font-bold text-indigo-400">{vecesIntervaloRef.current}</p>
            <p className="text-zinc-500 text-xs">guardado en useRef → no dispara render</p>
          </div>
          <div className="bg-zinc-700 rounded-lg p-4 space-y-1">
            <p className="text-zinc-400">Re-renders del componente</p>
            <p className="text-3xl font-bold text-emerald-400">{renderCount}</p>
            <p className="text-zinc-500 text-xs">solo cuando actualizamos renderCount con useState</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={iniciar}
            disabled={corriendo}
            className="px-4 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            Iniciar intervalo
          </button>
          <button
            onClick={detener}
            disabled={!corriendo}
            className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-40 transition-colors"
          >
            Detener
          </button>
        </div>

        <p className="text-zinc-500 text-xs">
          El intervalId se guarda en <code className="bg-zinc-700 px-1 rounded">intervalIdRef.current</code>.
          React no sabe que existe. Ni crea, ni limpia nada automáticamente → nosotros lo hacemos en{" "}
          <code className="bg-zinc-700 px-1 rounded">useEffect</code>.
        </p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 4 — useRef: caso C — valor previo
// ─────────────────────────────────────────────────────────────────────────────

const SeccionRefPrevio = () => {
  const [valor, setValor] = useState(0);
  // Patrón clásico: guardar el valor del render anterior.
  // En cada render: primero React ejecuta el cuerpo → valorPrevio.current
  // todavía tiene el valor ANTERIOR. Luego el effect actualiza el ref.
  // → Siempre hay un render de desfase, que es exactamente lo que queremos.
  const valorPrevioRef = useRef<number>(0);

  useEffect(() => {
    valorPrevioRef.current = valor;
  });

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">useRef — Caso C: valor previo</h2>

      <div className="bg-zinc-800 rounded-xl p-5 text-sm text-zinc-300 leading-relaxed">
        <p>
          <span className="text-yellow-400 font-semibold">¿Cuándo usarlo?</span> Cuando necesitas
          comparar el valor actual de un estado/prop con el que tenía en el render anterior (por
          ejemplo, detectar si un valor subió o bajó).
        </p>
      </div>

      <div className="bg-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="bg-zinc-700 rounded-lg p-4 text-center space-y-1 min-w-28">
            <p className="text-zinc-400">Valor previo</p>
            <p className="text-3xl font-bold text-zinc-300">{valorPrevioRef.current}</p>
          </div>
          <span className="text-2xl text-zinc-500">→</span>
          <div className="bg-zinc-700 rounded-lg p-4 text-center space-y-1 min-w-28">
            <p className="text-zinc-400">Valor actual</p>
            <p className="text-3xl font-bold text-indigo-400">{valor}</p>
          </div>
          {valor !== valorPrevioRef.current && (
            <span className={`text-sm font-semibold ${valor > valorPrevioRef.current ? "text-emerald-400" : "text-red-400"}`}>
              {valor > valorPrevioRef.current ? "▲ subió" : "▼ bajó"}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setValor((v) => v + 1)}
            className="px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
          >
            +1
          </button>
          <button
            onClick={() => setValor((v) => v - 1)}
            className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
          >
            -1
          </button>
          <button
            onClick={() => setValor(Math.floor(Math.random() * 50))}
            className="px-4 py-2 rounded bg-zinc-600 text-white text-sm hover:bg-zinc-500 transition-colors"
          >
            Aleatorio
          </button>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN FINAL
// ─────────────────────────────────────────────────────────────────────────────

const Resumen = () => (
  <section className="bg-zinc-800 rounded-xl p-6 space-y-4">
    <h2 className="text-xl font-bold text-white">Cuándo usar cada uno — resumen</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <h3 className="text-indigo-400 font-semibold">useCallback</h3>
        <ul className="space-y-1 text-zinc-300">
          <li className="flex gap-2"><span className="text-emerald-400">✓</span> Función pasada como prop a un hijo con <code className="bg-zinc-700 px-1 rounded">memo</code></li>
          <li className="flex gap-2"><span className="text-emerald-400">✓</span> Función usada como dependencia de otro <code className="bg-zinc-700 px-1 rounded">useEffect</code></li>
          <li className="flex gap-2"><span className="text-red-400">✗</span> Funciones que no se pasan a ningún hijo</li>
          <li className="flex gap-2"><span className="text-red-400">✗</span> Hijos que NO están envueltos en <code className="bg-zinc-700 px-1 rounded">memo</code></li>
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-emerald-400 font-semibold">useRef</h3>
        <ul className="space-y-1 text-zinc-300">
          <li className="flex gap-2"><span className="text-emerald-400">✓</span> Acceder / manipular un elemento del DOM</li>
          <li className="flex gap-2"><span className="text-emerald-400">✓</span> Guardar IDs de timers, intervals, sockets</li>
          <li className="flex gap-2"><span className="text-emerald-400">✓</span> Recordar el valor del render anterior</li>
          <li className="flex gap-2"><span className="text-red-400">✗</span> Valores que al cambiar deben actualizar la UI → usa <code className="bg-zinc-700 px-1 rounded">useState</code></li>
        </ul>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function HooksClasePage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">useCallback & useRef</h1>
          <p className="text-zinc-400">
            Dos hooks para salir del flujo reactivo cuando React se interpone en tu camino.
          </p>
        </header>

        <SeccionUseCallback />
        <hr className="border-zinc-700" />
        <SeccionRefDom />
        <hr className="border-zinc-700" />
        <SeccionRefValor />
        <hr className="border-zinc-700" />
        <SeccionRefPrevio />
        <hr className="border-zinc-700" />
        <Resumen />
      </div>
    </main>
  );
}
