import type { WatchITPlayerSelected } from "./WatchITPlayerSelected";

export interface WatchITPlayerInMatch{
    player: WatchITPlayerSelected;
    match_status: string;
    createdAt: any;
    match_id: string;
}