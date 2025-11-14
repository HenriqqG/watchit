import React from "react";
import { generateCodeChallenge, generateCodeVerifier } from "../../util/pkce_utils";
import { tl } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";
import faceitIcon from "../../assets/faceitIcon.png";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = "https://watchit.gg/callback";
const SCOPE = "openid email profile membership";

const FaceitLogin: React.FC = () => {
  const { currentLanguage } = useLanguage();

  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    sessionStorage.setItem("pkce_verifier", verifier);

    const stateObj = {
      csrf: crypto.randomUUID(),
      redirectTo: "/"+currentLanguage.id+"/watch",
    };
    const state = btoa(JSON.stringify(stateObj));
    sessionStorage.setItem("oauth_state", state);

    const authUrl =
      `https://accounts.faceit.com/authorize` +
      `?response_type=code` +
      `&client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPE)}` +
      `&state=${state}` +
      `&code_challenge=${challenge}` +
      `&redirect_popup=true` +
      `&code_challenge_method=S256`;

    window.location.href = authUrl;
  };

  return (
    <div>
      <button
        className="flex items-center justify-center play-bold gap-3 bg-[#f50] border-none rounded-sm px-4 py-2.5 font-bold cursor-pointer decoration-white"
        onClick={handleLogin}
        style={{
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e14f00")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f50")}>
        <img src={`${faceitIcon}`} alt="FACEIT" width="22"height="18"/>
        {tl(currentLanguage, 'login.log_w_faceit')}
      </button>
    </div >
  );
};

export default FaceitLogin;
