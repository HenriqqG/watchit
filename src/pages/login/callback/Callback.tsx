import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const verifier = sessionStorage.getItem("pkce_verifier");
      fetch(`/callback?code=${code}&verifier=${verifier}`)
        .then((res) => res.json())
        .then((tokens) => console.log("Tokens Faceit:", tokens))
        .catch(console.error);
    }
  }, []);

  return <p>Autenticando com Faceit...</p>;
}