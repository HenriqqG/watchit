import React, { useEffect, useState } from "react";
import { generateCodeChallenge, generateCodeVerifier } from "../util/pkce_utils";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = "https://watchit-cs.netlify.app/callback";
const SCOPE = "openid email profile membership";
const STATE = Math.random().toString();

const FaceitLogin: React.FC = () => {
  const [tokens, setTokens] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    sessionStorage.setItem("pkce_verifier", verifier);

    const authUrl =
      `https://accounts.faceit.com/authorize` +
      `?response_type=code` +
      `&client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPE)}` +
      `&state=${STATE}` +
      `&code_challenge=${challenge}` +
      `&redirect_popup=true` +
      `&code_challenge_method=S256`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    const verifier = sessionStorage.getItem("pkce_verifier");
    if (!verifier) {
      console.error("PKCE verifier não encontrado.");
      return;
    }

    setLoading(true);

    fetch(`/callback?code=${code}&verifier=${verifier}`)
      .then((res) => res.json())
      .then((data) => {
        setTokens(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao obter token:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {!tokens ? (
        <>
          <h1>Login com Faceit</h1>
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#f50",
              color: "white",
              border: "none",
            }}
          >
            {loading ? "Carregando..." : "Entrar com Faceit"}
          </button>
        </>
      ) : (
        <>
          <h2>Tokens recebidos</h2>
          <pre
            style={{
              textAlign: "left",
              background: "#222",
              color: "#0f0",
              padding: "1rem",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(tokens, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default FaceitLogin;
