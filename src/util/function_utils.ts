import { languages, type Language } from "../translations/translation";
import type { Payload } from "../types/responses/FaceitLiveMatchesResponse";
import { sendPlayerToWorkerQueue } from "./faceit_utils";

export function getElapsedTime(epochString: string) {
  let date = new Date();
  if (typeof epochString === "string") {
    date = new Date(epochString);
  } else {
    date = new Date(epochString * 1000);
  }
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  if (diffSec > 0) return `${diffSec}s ago`;
  return `0s ago`;
};

export function getElapsedTimeMMSS(epochString: string | number) {
  const start =
    typeof epochString === "string"
      ? new Date(epochString)
      : new Date(epochString * 1000);

  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  if (diffMs < 0) return "00:00:00";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


export function formatTimeDisplay(sliderVal: any) {
  const minutes = (sliderVal / 100) * 60;
  if (minutes === 60) return "1h";
  if (minutes === 0) return "Now";
  return `${Math.round(minutes)} m`;
};

export function getInitialLanguage(): Language {
  try {
    const savedLangId = localStorage.getItem("selectedLanguageId");

    if (!savedLangId) {
      return languages[0];
    }

    const foundLanguage = languages.find((lang) => lang.id === savedLangId);

    return foundLanguage || languages[0];
  } catch (error) {
    console.error("Failed to get language from localStorage:", error);
    return languages[0];
  }
}

export function addSelectedPlayerToWorkerQueue(listPlayers: any[]): Promise<void> {
  return new Promise((resolve) => {
    let completed = 0;
    listPlayers.forEach((p) => {
      sendPlayerToWorkerQueue(p.player_id)
        .finally(() => {
          completed++;
          if (completed === listPlayers.length) {
            resolve();
          }
        });
    });
  });
}

export function fetchDataFromExtension(payload: any) {
  return new Promise((resolve, reject) => {
    const requestId = `${Date.now()}-${Math.random()}`;

    function handleResponse(event: any) {
      if (event.source !== window) return;
      const msg = event.data;
      if (msg && msg.direction === "FROM_EXTENSION" && msg.requestId === requestId) {
        window.removeEventListener("message", handleResponse);
        if (msg.payload && msg.payload.success) resolve(msg.payload.data);
        else reject(msg.payload?.error || "Erro desconhecido");
      }
    }

    window.addEventListener("message", handleResponse);

    window.postMessage({
      direction: "FROM_PAGE",
      action: payload.action,
      entityId: payload.entityId,
      requestId
    }, "*");

    setTimeout(() => {
      window.removeEventListener("message", handleResponse);
      reject("Timeout: sem resposta da extensão");
    }, 10_000);
  });
}

export const getFlagUrl = (langId: string) => {
  let countryCode = langId.toUpperCase();
  if (langId === 'pt-br') countryCode = 'BR';
  if (langId === 'es') countryCode = 'AR';
  if (langId === 'en') countryCode = 'US';

  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;
};

export function isHighLevelMatch(match: Payload): boolean {
  const isSuperAndLive = match.state !== "CHECK_IN";
  if (isSuperAndLive) {
    // const isLevel10Plus = Object.values(match.teams).every(team =>
    //   team.roster.every((player: Roster) => player.gameSkillLevel >= 10)
    // );
    // return isLevel10Plus;
    const faction1Rating = match.teams.faction1?.stats?.rating || 0;
    const faction2Rating = match.teams.faction2?.stats?.rating || 0;

    const isHighRating = faction1Rating > 2000 && faction2Rating > 2000;
    return isHighRating;
  }
  return isSuperAndLive;
}