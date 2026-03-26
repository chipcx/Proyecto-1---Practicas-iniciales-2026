import { useState } from "react";
import AuthService from "../services/authService";
import "./LoginForm.css";

export default function ForgotPassword() {
  const [registro, setRegistro] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = verify, 2 = set new password
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Verify identity
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

  // Step 2: Set new password
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
      setStep(3); // show success
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

        {error && <div className="alert alert-danger">{error}</div>}
        {mensaje && <div className="alert alert-success" style={{ color: '#28a745', background: '#d4edda', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{mensaje}</div>}

        {step === 1 && (
          <form onSubmit={handleVerify}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Ingresa tu registro académico y email para verificar tu identidad.
            </p>
            <div className="form-group">
              <label htmlFor="registro">Registro Académico:</label>
              <input
                id="registro"
                type="text"
                placeholder="Ej: 202100001"
                value={registro}
                onChange={(e) => setRegistro(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="forgot-email">Email:</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Verificando...' : 'Verificar Identidad'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Identidad verificada. Ingresa tu nueva contraseña.
            </p>
            <div className="form-group">
              <label htmlFor="new-password">Nueva Contraseña:</label>
              <input
                id="new-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar Contraseña:</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              ✅ Tu contraseña fue actualizada exitosamente.
            </p>
            <a href="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>
              Ir a Iniciar Sesión
            </a>
          </div>
        )}

        {step !== 3 && (
          <p className="signup-link" style={{ marginTop: '1rem' }}>
            <a href="/login">← Volver al Login</a>
          </p>
        )}
      </div>
    </div>
  );
}
