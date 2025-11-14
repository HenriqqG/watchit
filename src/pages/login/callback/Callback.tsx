import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/AuthStore";
import Loading from "../../../components/general-components/Loading";
import { useLanguage } from "../../../contexts/LanguageContext";
import { tl } from "../../../translations/translation";

const API_URL = import.meta.env.VITE_API_URL;

export default function Callback() {
  
  const { currentLanguage } = useLanguage();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const verifier = sessionStorage.getItem("pkce_verifier");
      const stateFromCallback = params.get("state");
      const savedState = sessionStorage.getItem("oauth_state");

      if (!code || !verifier) {
        setError("Parâmetros inválidos ou sessão expirada.");
        setLoading(false);
        return;
      }

      if (stateFromCallback !== savedState) {
        setError("Estado inválido. Possível ataque CSRF.");
        setLoading(false);
        return;
      }

      let redirectTo = "/"+currentLanguage.id+"/me";
      try {
        const decodedState = JSON.parse(atob(stateFromCallback!));
        if (decodedState.redirectTo) redirectTo = decodedState.redirectTo;
      } catch { }

      try {
        const response = await fetch(`${API_URL}/api/auth/callback?code=${code}&verifier=${verifier}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Falha na autenticação.");
        }

        await fetchUser();
        sessionStorage.removeItem("pkce_verifier");
        sessionStorage.removeItem("oauth_state");
        window.location.href = redirectTo;
      } catch (err: any) {
        console.error("Erro no callback:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    processCallback();
  }, [fetchUser]);

  if (loading) return (
    <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
      <section className="w-full">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
          <Loading></Loading>
        </div>
      </section>
    </main>
  );
  if (error)
    return (
      <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
        <section className="w-full">
          <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
            <div className="p-5">
              <p style={{ color: "red" }} className="pb-5">{tl(currentLanguage, 'callback_page.error_message')}: {error}</p>
              <a href="/">{tl(currentLanguage, 'callback_page.return_homepage')}</a>
            </div>
          </div>
        </section>
      </main>
    );
  return (
    <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
      <section className="w-full">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
          <p>{tl(currentLanguage, 'callback_page.sucess')}</p>
        </div>
      </section>
    </main>
  );
}