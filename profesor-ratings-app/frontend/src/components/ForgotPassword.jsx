import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import "./LoginForm.css";

export default function ForgotPassword() {
  const [registro, setRegistro] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);
    try {
      const res = await AuthService.forgotPassword(registro, email);
      setMensaje(res.data.message || "Usuario verificado");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Error al verificar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.resetPassword(registro, email, newPassword);
      setMensaje(res.data.message || "Contraseña actualizada con éxito");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Recuperar Contraseña</h2>
        <p className="subtitle">
          {step === 1 && "Verifica tu identidad para continuar"}
          {step === 2 && "Establece tu nueva contraseña"}
          {step === 3 && "¡Proceso completado!"}
        </p>

        {/* Step indicators */}
        <div className="step-indicator">
          <span className={`step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}></span>
          <span className={`step-dot ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}></span>
          <span className={`step-dot ${step >= 3 ? 'done' : ''}`}></span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {mensaje && <div className="alert alert-success">{mensaje}</div>}

        {step === 1 && (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="fp-registro">Registro Académico</label>
              <input
                id="fp-registro"
                type="text"
                placeholder="Ej: 202100001"
                value={registro}
                onChange={(e) => setRegistro(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Verificando..." : "Verificar Identidad"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label htmlFor="fp-newpass">Nueva Contraseña</label>
              <input
                id="fp-newpass"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fp-confirm">Confirmar Contraseña</label>
              <input
                id="fp-confirm"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Tu contraseña fue actualizada exitosamente.
            </p>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%' }}>
              Ir a Iniciar Sesión
            </button>
          </div>
        )}

        {step !== 3 && (
          <p className="signup-link">
            <Link to="/login">← Volver al Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
