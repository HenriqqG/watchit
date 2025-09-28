const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

/** Info about player returned by API v4 */
interface V4PlayersResponse {
  player_id: string;
  avatar: string;
  cover_image: string;
  nickname: string;
  games: {
    cs2?: {
      faceit_elo: number;
      skill_level: number;
      region: string;
    };
  };
}

/** FACEIT player profile. */
// interface FaceitPlayer {
//   id: string;
//   username: string;
//   banner?: string;
//   level?: number;
//   elo?: number;
//   wins: number;
//   ranking: number;
//   losses: number;
//   avg: {
//     kills: number;
//     hspercent: number;
//     deaths: number;
//     kd: number;
//     wins: number;
//     matches: number;
//   };
// }

/** Info about players returned by API v4 */
interface SearchAPIResponse {
  start: number;
  end: number;
  items: any[];
}

/** Info about matches returned by API v4 */
interface MatchesAPIResponse {
  payload: {
    [key: string]: [ {
        id: string,
        game: string,
        region: string,
        teams: {
            faction1: {
              id: string,
              avatar: string,
              name: string,
              leader: string,
              roster: [
                  {
                      id: string,
                      avatar: string,
                      nickname: string
                  }
              ]
            },
            faction2: {
              id: string,
              avatar: string,
              name: string,
              leader: string,
              roster: [
                  {
                      id: string,
                      avatar: string,
                      nickname: string
                  }
              ]
            }
        }
        state: string,
        status: string,
        playing: boolean,
        createdAt: Date
      }
    ]
  }
}

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

export function getPlayerProfile(
  username: string
): Promise<V4PlayersResponse | undefined> {
  return new Promise<V4PlayersResponse | undefined>((resolve) => {
    fetch(
      `https://open.faceit.com/data/v4/players${username.length > 12 ? `/${username}` : `?nickname=${username}`}`,
      {
        headers: HEADERS,
      }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const v4PlayersResponse = (await response.json()) as V4PlayersResponse;
      resolve(v4PlayersResponse);
    });
  });
}

export function getPlayersByUsername(
    username: string
): Promise<SearchAPIResponse  | undefined> {
  return new Promise<SearchAPIResponse | undefined>((resolve) => {
    fetch(
      `https://open.faceit.com/data/v4/search/players?nickname=${username}&game=cs2`, { headers: HEADERS }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return ;
      }
      const v4PlayersResponseList = (await response.json()) as SearchAPIResponse;
      resolve(v4PlayersResponseList);
    });
  });
}

export function getPlayerInONGOINGMatch(
    player_id: string
): Promise<MatchesAPIResponse  | undefined> {
  return new Promise<MatchesAPIResponse | undefined>((resolve) => {
    fetch(`${API_URL}/matches/${player_id}`)
    .then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return ;
      }
      const MatchesAPIResponse = (await response.json()) as MatchesAPIResponse;
      resolve(MatchesAPIResponse);
    });
  });
}