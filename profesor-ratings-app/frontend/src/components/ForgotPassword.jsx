// src/components/ForgotPassword.jsx
import { useState } from "react";
import AuthService from "../services/authService";
import "./LoginForm.css"; // puedes usar el mismo archivo o crear uno nuevo

export default function ForgotPassword() {
  const [registro, setRegistro] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.forgotPassword(registro, email);
      setMensaje(res.data.message || "Token generado, revisa tu correo");
    } catch (err) {
      //  Mostrar el mensaje real que manda el backend
      setMensaje(err.response?.data?.error || "Error al solicitar recuperación");
      console.error("Error en forgot-password:", err.response?.data); // opcional, para ver en consola
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Registro académico"
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}
