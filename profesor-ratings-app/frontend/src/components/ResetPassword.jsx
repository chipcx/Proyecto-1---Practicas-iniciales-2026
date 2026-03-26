// src/components/ResetPassword.jsx
import { useState } from "react";
import AuthService from "../services/authService";
import "./LoginForm.css"; // puedes usar el mismo archivo o crear uno nuevo

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.resetPassword(token, newPass);
      setMensaje(res.data.message || "Contraseña actualizada con éxito");
    } catch (err) {
      setMensaje("Error al actualizar contraseña");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-form">
        <h2>Restablecer contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>
          <button type="submit">Actualizar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}
