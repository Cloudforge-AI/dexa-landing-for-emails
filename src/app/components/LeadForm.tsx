"use client";

import { FormEvent, useState } from "react";

type UserType = "dentist" | "patient";
type FormStatus = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("patient");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, type: userType }),
        }
      );

      if (!res.ok) throw new Error("Error al enviar el formulario.");

      setStatus("success");
      setName("");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Ocurrio un error. Intenta de nuevo."
      );
    }
  };

  return (
    <section id="lead-form" className="bg-bg py-24">
      <div className="mx-auto max-w-md px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-darkest sm:text-4xl">
          Solicita Acceso Anticipado
        </h2>
        <p className="mt-4 text-center text-base leading-relaxed text-gray">
          Se de los primeros en probar DexaVision. Dejanos tu correo y te
          contactaremos.
        </p>

        {status === "success" ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-8 text-center">
            <svg
              className="h-12 w-12 text-success"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="text-lg font-bold text-success">
              ¡Registro exitoso!
            </p>
            <p className="text-sm text-gray">
              Te contactaremos pronto con mas informacion.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-darkest"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-darkest outline-none transition-all placeholder:text-gray/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-darkest"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-darkest outline-none transition-all placeholder:text-gray/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* User type toggle */}
            <div>
              <span className="mb-2 block text-sm font-semibold text-darkest">
                Tipo de usuario
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("patient")}
                  className={`flex-1 rounded-[10px] border px-4 py-2.5 text-sm font-bold transition-all ${
                    userType === "patient"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-stroke bg-white text-gray hover:border-primary/40"
                  }`}
                >
                  Soy paciente
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("dentist")}
                  className={`flex-1 rounded-[10px] border px-4 py-2.5 text-sm font-bold transition-all ${
                    userType === "dentist"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-stroke bg-white text-gray hover:border-primary/40"
                  }`}
                >
                  Soy dentista
                </button>
              </div>
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="rounded-lg bg-error/5 px-4 py-2.5 text-sm font-medium text-error">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 flex items-center justify-center gap-2 rounded-[10px] px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-60"
              style={{ background: "var(--gradient-btn)" }}
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Enviando...
                </>
              ) : (
                "Solicitar Acceso"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
