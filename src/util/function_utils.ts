import { languages, type Language } from "../translations/translation";
import { sendPlayerToWorkerQueue } from "./faceit_utils";

export function splitIntoColumns<T>(
  items: T[],
  itemsPerColumn: number,
  maxColumns: number
): T[][] {
  const columns: T[][] = [];
  for (let col = 0; col < maxColumns; col++) {
    const start = col * itemsPerColumn;
    const end = start + itemsPerColumn;
    const columnItems = items.slice(start, end);
    if (columnItems.length > 0) columns.push(columnItems);
  }
  return columns;
}

export function getElapsedTime(epochString: string) {
  let date = new Date();
  if(typeof epochString === "string"){
    date = new Date(epochString);
  }else{
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
  return `${diffSec}s ago`;
};

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