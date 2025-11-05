import { useSelectedPlayerContext } from "../contexts/SelectedPlayerContext";

import type { WatchITPlayerSelected } from "../types/WatchITPlayerSelected";

import { getPlayerProfile, sendPlayerToWorkerQueue } from "../util/faceit_utils";
import { addSelectedPlayerToWorkerQueue } from "../util/function_utils";

interface UsePlayerHookParams {
  onPlayerAdd: () => void;
  onPlayerRemove: () => void;
  onError: () => void;
  onErrorMaxLength: () => void;
  onChoosingPlayer: () => void;
  onListLoadedOrUpdated: (players: WatchITPlayerSelected[]) => void;
  onListLoadedOrUpdatedRecentGames: (players: WatchITPlayerSelected[]) => void;
}

export function usePlayerHook({
  onPlayerAdd,
  onPlayerRemove,
  onError,
  onErrorMaxLength,
  onChoosingPlayer,
  onListLoadedOrUpdated,
  onListLoadedOrUpdatedRecentGames
}: UsePlayerHookParams) {
  const { selectedPlayers, selectedPlayersRef, setSelectedPlayers } = useSelectedPlayerContext();

  //const { user, isAuthenticated } = useAuthStore();

  //const LIST_MAX_VALUE = (isAuthenticated && user?.isSubscriber) ? 30 : 20;
  const LIST_MAX_VALUE = 30;

  const handlePlayerSelect = (item: any): boolean => {
    if (selectedPlayers.some((i) => i.player_id === item.player_id)) {
      onError();
      return false;
    }

    if (selectedPlayers.length == LIST_MAX_VALUE) {
      onErrorMaxLength();
      return false;
    }

    onChoosingPlayer();

    sendPlayerToWorkerQueue(item.player_id).then(() => {
      getPlayerProfile(item.player_id).then(async (response) => {
        const updated: WatchITPlayerSelected[] = [
          ...selectedPlayersRef.current,
          {
            ...item,
            nickname: response?.nickname || "",
            avatar: response?.avatar || "",
            country: response?.country.toUpperCase() || "",
            cover_image: response?.cover_image,
            skill_level: response?.games.cs2?.skill_level
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 2_000));
        setSelectedPlayers(updated);
        onListLoadedOrUpdated(updated);
        onListLoadedOrUpdatedRecentGames(updated);
      }).finally(() => onPlayerAdd());
    });

    return true;
  };

  const handlePlayerRemove = (nickname: string) => {
    const updated = selectedPlayersRef.current.filter((p) => p.nickname !== nickname);
    setSelectedPlayers(updated);
    addSelectedPlayerToWorkerQueue(updated).then(() => {
      onListLoadedOrUpdated(updated);
      onListLoadedOrUpdatedRecentGames(updated);
    });
    onPlayerRemove();
  };

  return {
    selectedPlayers,
    selectedPlayersRef,
    handlePlayerSelect,
    handlePlayerRemove
  };
}