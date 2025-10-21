import { useSelectedPlayerContext, type WatchedPlayer } from "../contexts/SelectedPlayerContext";
import { getPlayerProfile, sendPlayerToWorkerQueue } from "../util/faceit_utils";
import { addSelectedPlayerToWorkerQueue } from "../util/function_utils";

interface UsePlayerHookParams {
  onPlayerAdd: () => void;
  onPlayerRemove: () => void;
  onError: () => void;
  onErrorMaxLength: () => void;
  onChoosingPlayer: () => void;
  onListLoadedOrUpdated: (players: WatchedPlayer[]) => void;
  onListLoadedOrUpdatedRecentGames: (players: WatchedPlayer[]) => void;
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

  const handlePlayerSelect = (item: any): boolean => {
    if (selectedPlayers.some((i) => i.player_id === item.player_id)) {
      onError();
      return false;
    }

    if (selectedPlayers.length >= 20) {
      onErrorMaxLength();
      return false;
    }

    onChoosingPlayer();

    sendPlayerToWorkerQueue(item.player_id).then(() => {
      getPlayerProfile(item.player_id).then((response) => {
        const updated: WatchedPlayer[] = [
          ...selectedPlayersRef.current,
          {
            ...item,
            nickname: response?.nickname || "",
            avatar: response?.avatar || "",
            country: response?.country.toUpperCase() || "",
            cover_image: response?.cover_image,
            games: [{ name: "cs2", skill_level: response?.games.cs2?.skill_level }]
          }
        ];

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