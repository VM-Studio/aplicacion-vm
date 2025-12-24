"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const USERS = [
  { username: "cliente123", password: "123", role: "cliente" },
  { username: "admin123", password: "123", role: "admin" },
];

export default function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) {
      if (isAdmin) {
        if (username === "admin123" && password === "123") {
          router.push("/admin");
        } else {
          setError("Solo puedes ingresar como administrador con admin123 / 123");
        }
      } else {
        if (username === "cliente123" && password === "123") {
          router.push("/cliente");
        } else {
          setError("Usuario o contraseña incorrectos");
        }
      }
    } else {
      setError("Solo puedes usar los usuarios predeterminados por ahora.");
    }
  }

  return (
  <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: 'Inter, Roboto, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif', fontWeight: 400, letterSpacing: 0.1 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 420,
          background: "#fcfdfc",
          borderRadius: 16,
          boxShadow: "0 2px 24px #0002",
          padding: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: 'Inter, Roboto, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif',
          fontWeight: 400,
          letterSpacing: 0.1,
        }}
      >
        <Image src="/navbar.gif" alt="Auth" width={120} height={120} style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 28, color: "#222", textAlign: "center" }}>
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>
        {!isLogin && (
          <div style={{ width: "100%", marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 15, fontWeight: 500, marginBottom: 4, color: '#111', fontFamily: 'inherit' }}>Nombre:</label>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 7, border: "1px solid #ccc", fontFamily: 'inherit', color: '#111' }}
            />
          </div>
        )}
        <div style={{ width: "100%", marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 500, marginBottom: 4, color: '#111', fontFamily: 'inherit' }}>{isLogin ? "Nombre/Usuario" : "Nombre/Usuario"}</label>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 7, border: "1px solid #ccc", fontFamily: 'inherit', color: '#111' }}
            autoFocus
          />
        </div>
        <div style={{ width: "100%", marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 500, marginBottom: 4, color: '#111', fontFamily: 'inherit' }}>Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 7, border: "1px solid #ccc", fontFamily: 'inherit', color: '#111' }}
          />
        </div>
        {isLogin && (
          <div style={{ width: "100%", marginBottom: 18, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="adminCheck"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="adminCheck" style={{ fontSize: 15, color: '#111', cursor: 'pointer', fontFamily: 'inherit' }}>¿Sos administrador?</label>
          </div>
        )}
        {!isLogin && (
          <div style={{ width: "100%", marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 15, fontWeight: 500, marginBottom: 4, color: '#111', fontFamily: 'inherit' }}>Número de Teléfono</label>
            <input
              type="tel"
              placeholder="Ej: 11 1234 5678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ width: "100%", padding: 12, borderRadius: 7, border: "1px solid #ccc", fontFamily: 'inherit', color: '#111' }}
            />
          </div>
        )}
  {error && <div style={{ color: "#d00", marginBottom: 14, fontSize: 15, fontFamily: 'inherit' }}>{error}</div>}
        <button
          type="submit"
          style={{ width: "100%", padding: 14, borderRadius: 7, background: "#0049ff", color: "#fff", fontWeight: 700, border: "none", marginBottom: 12, fontSize: 17, fontFamily: 'inherit' }}
        >
          {isLogin ? "Entrar" : "Registrarse"}
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
          style={{ background: "none", border: "none", color: "#0049ff", cursor: "pointer", fontSize: 15, fontFamily: 'inherit' }}
        >
          {isLogin ? "¿No tienes cuenta? Registrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </div>
  );
}
