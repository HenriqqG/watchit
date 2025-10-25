import type { FaceitMatch } from "../layouts/responses/FaceitMatch";
import type { PlayerProfileResponse } from "../layouts/responses/PlayerProfileResponse";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const FACEIT_API = 'https://open.faceit.com/data/v4';

interface SearchAPIResponse {
  start: number;
  end: number;
  items: any[];
}

interface AddToQueueResponse {
  status: string;
  playerId: string;
}

interface BatchAddToQueueResponse {
  status: string;
  playerId: string[];
}

interface GetFromQueueResponse {
  match: FaceitMatch;
  playerId: string;
}

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

export function getPlayerProfile(
  username: string
): Promise<PlayerProfileResponse | undefined> {
  return new Promise<PlayerProfileResponse | undefined>((resolve) => {
    fetch(
      `${FACEIT_API}/players${username.length > 12 ? `/${username}` : `?nickname=${username}`}`,
      {
        headers: HEADERS,
      }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const v4PlayersResponse = (await response.json()) as PlayerProfileResponse;
      resolve(v4PlayersResponse);
    });
  });
}

export function getPlayersByUsername(
  username: string
): Promise<SearchAPIResponse | undefined> {
  return new Promise<SearchAPIResponse | undefined>((resolve) => {
    fetch(
      `${FACEIT_API}/search/players?nickname=${username}&game=cs2`, { headers: HEADERS }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const v4PlayersResponseList = (await response.json()) as SearchAPIResponse;
      resolve(v4PlayersResponseList);
    });
  });
}

export function getPlayerTimeSinceLastMatch(
  player_id: string
): Promise<SearchAPIResponse | undefined> {
  return new Promise<SearchAPIResponse | undefined>((resolve) => {
    fetch(
      `${FACEIT_API}/players/${player_id}/history`, { headers: HEADERS }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const SearchAPIResponse = (await response.json()) as SearchAPIResponse;
      resolve(SearchAPIResponse);
    });
  });
}

export function sendPlayerToWorkerQueue(
  player_id: string
): Promise<AddToQueueResponse | undefined> {
  return new Promise<AddToQueueResponse | undefined>((resolve) => {
    fetch(`${API_URL}/player/${player_id}`, {
      method: 'POST',
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error(await response.text());
          resolve(undefined);
          return;
        }
        const AddToQueueResponse = (await response.json()) as AddToQueueResponse;
        resolve(AddToQueueResponse);
      });
  });
}

export function getPlayerResultFromWorkerQueue(
  player_id: string
): Promise<GetFromQueueResponse | undefined> {
  return new Promise<GetFromQueueResponse | undefined>((resolve) => {
    fetch(`${API_URL}/player/${player_id}`, {
      method: 'GET',
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error(await response.text());
          resolve(undefined);
          return;
        }
        const GetFromQueueResponse = (await response.json()) as GetFromQueueResponse;
        resolve(GetFromQueueResponse);
      });
  });
}

export function sendBatchPlayerToWorkerQueue(
  playerIds: string[]
): Promise<BatchAddToQueueResponse | undefined> {
  return new Promise<BatchAddToQueueResponse | undefined>((resolve) => {
    fetch(`${API_URL}/player/batch/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerIds }),
    }).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const BatchAddToQueueResponse = (await response.json()) as BatchAddToQueueResponse;
      resolve(BatchAddToQueueResponse);
    });
  });
}