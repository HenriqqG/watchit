export interface FaceitLiveMatchesResponse {
  code: string
  env: string
  message: string
  payload: Payload[]
  time: number
  version: string
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface Payload {
  id: string
  type: string
  game: string
  region: string
  organizerId: string
  entity: Entity
  entityCustom: EntityCustom
  allowOngoingJoin: boolean
  anticheatMode: string
  calculateElo: boolean
  afkAction: string
  drawAction: string
  failAction: string
  fbiManagement: boolean
  adminTool: boolean
  checkIn: CheckIn
  state: string
  status: string
  states: string[]
  spectators: any[]
  matchCustom: MatchCustom
  locations: Location2[]
  timeToConnect: number
  version: number
  createdAt: string
  lastModified: string
  parties: Party[]
  rosterWithSubstitutes: boolean
  tags: string[]
  voteKick: VoteKick2
  teams: Teams
  anticheatRequired: boolean
  skillFeedback: string
  round?: number
  voting?: Voting
  maps?: Map3[]
  demoURLs?: any[]
  configuredAt?: string
  readyAt?: string
  startedAt?: string
  summaryResults?: SummaryResults
  results?: Result[]
}

export interface Entity {
  type: string
  id: string
  name: string
}

export interface EntityCustom {
  queueId: string
  matcherMatchId: string
  effectiveRanking: number
}

export interface CheckIn {
  time: number
  totalCheckedIn: number
  totalPlayers: number
  endTime: string
  checkedIn: boolean
}

export interface MatchCustom {
  id: string
  overview: Overview
  tree: Tree
}

export interface Overview {
  description: Description
  game: string
  label: Label
  name: string
  region: string
  round: Round
  detections: Detections
  spectators: boolean
  elo_mode: string
  expire_seconds: number
  flexible_factions: boolean
  grouping_stats: string
  max_players: number
  min_players: number
  team_size: number
  time_to_connect: number
  time_out_select_random: boolean
  organizer_id: string
  elo_type: string
  match_configuration_type: MatchConfigurationType
  match_finished_type: MatchFinishedType
  game_type: string
}

export interface Description {
  en: string
}

export interface Label {
  en: string
}

export interface Round {
  label: Label2
  id: string
  type: string
  to_play: number
  to_win: number
}

export interface Label2 {
  en: string
}

export interface Detections {
  afk: boolean
  leavers: boolean
}

export interface MatchConfigurationType {
  value: string
  label: Label3
}

export interface Label3 {
  en: string
}

export interface MatchFinishedType {
  value: string
  label: Label4
}

export interface Label4 {
  en: string
}

export interface Tree {
  game_config: GameConfig
  location: Location
  map: Map
  server_config: ServerConfig
  stream: Stream
}

export interface GameConfig {
  data_type: string
  flags: Flags
  id: string
  leaf_node: boolean
  values: Values
}

export interface Flags {}

export interface Values {
  value: string
}

export interface Location {
  data_type: string
  display: Display
  flags: Flags2
  id: string
  label: Label5
  leaf_node: boolean
  name: string
  values: Values2
}

export interface Display {
  priority: number
}

export interface Flags2 {}

export interface Label5 {
  en: string
}

export interface Values2 {
  multi_select: MultiSelect
  value: Value[]
  voting_steps: string[]
}

export interface MultiSelect {
  memberships: any[]
  minimum: number
}

export interface Value {
  class_name: string
  game_location_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface Map {
  data_type: string
  display: Display2
  flags: Flags3
  id: string
  label: Label6
  leaf_node: boolean
  name: string
  values: Values3
}

export interface Display2 {
  priority: number
}

export interface Flags3 {
  votable: boolean
}

export interface Label6 {
  en: string
}

export interface Values3 {
  multi_select: MultiSelect2
  value: Value2[]
  voting_steps: string[]
}

export interface MultiSelect2 {
  memberships: string[]
  minimum: number
}

export interface Value2 {
  class_name: string
  game_map_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface ServerConfig {
  children: Children
  id: string
}

export interface Children {
  autoKick: AutoKick
  bots: Bots
  botsDifficulty: BotsDifficulty
  deadTalk: DeadTalk
  freezeTime: FreezeTime
  friendlyFire: FriendlyFire
  gameMode: GameMode
  gameType: GameType
  knifeRound: KnifeRound
  maxRounds: MaxRounds
  overtimeHalftimePausetimer: OvertimeHalftimePausetimer
  overtimeMaxRounds: OvertimeMaxRounds
  overtimeStartMoney: OvertimeStartMoney
  pause: Pause
  pauseTime: PauseTime
  startMoney: StartMoney
  startOnReady: StartOnReady
  timeToConnect: TimeToConnect
  timeoutMax: TimeoutMax
  timeoutTime: TimeoutTime
  tvDelay: TvDelay
  voteKick: VoteKick
}

export interface AutoKick {
  data_type: string
  flags: Flags4
  id: string
  leaf_node: boolean
  values: Values4
}

export interface Flags4 {}

export interface Values4 {
  value: boolean
}

export interface Bots {
  data_type: string
  flags: Flags5
  id: string
  leaf_node: boolean
  values: Values5
}

export interface Flags5 {}

export interface Values5 {
  value: boolean
}

export interface BotsDifficulty {
  data_type: string
  flags: Flags6
  id: string
  leaf_node: boolean
  values: Values6
}

export interface Flags6 {}

export interface Values6 {
  max_value: number
  min_value: number
  value: number
}

export interface DeadTalk {
  data_type: string
  display: Display3
  flags: Flags7
  id: string
  label: Label7
  leaf_node: boolean
  name: string
  values: Values7
}

export interface Display3 {
  priority: number
}

export interface Flags7 {}

export interface Label7 {
  en: string
}

export interface Values7 {
  value: boolean
}

export interface FreezeTime {
  data_type: string
  flags: Flags8
  id: string
  leaf_node: boolean
  values: Values8
}

export interface Flags8 {}

export interface Values8 {
  value: number
}

export interface FriendlyFire {
  data_type: string
  flags: Flags9
  id: string
  leaf_node: boolean
  values: Values9
}

export interface Flags9 {}

export interface Values9 {
  value: boolean
}

export interface GameMode {
  data_type: string
  flags: Flags10
  id: string
  leaf_node: boolean
  values: Values10
}

export interface Flags10 {}

export interface Values10 {
  value: number
}

export interface GameType {
  data_type: string
  flags: Flags11
  id: string
  leaf_node: boolean
  values: Values11
}

export interface Flags11 {}

export interface Values11 {
  max_value: number
  min_value: number
  value: number
}

export interface KnifeRound {
  data_type: string
  flags: Flags12
  id: string
  leaf_node: boolean
  values: Values12
}

export interface Flags12 {}

export interface Values12 {
  value: boolean
}

export interface MaxRounds {
  data_type: string
  flags: Flags13
  id: string
  leaf_node: boolean
  values: Values13
}

export interface Flags13 {}

export interface Values13 {
  max_value: number
  min_value: number
  value: number
}

export interface OvertimeHalftimePausetimer {
  data_type: string
  flags: Flags14
  id: string
  leaf_node: boolean
  values: Values14
}

export interface Flags14 {}

export interface Values14 {
  value: boolean
}

export interface OvertimeMaxRounds {
  data_type: string
  flags: Flags15
  id: string
  leaf_node: boolean
  values: Values15
}

export interface Flags15 {}

export interface Values15 {
  max_value: number
  min_value: number
  value: number
}

export interface OvertimeStartMoney {
  data_type: string
  flags: Flags16
  id: string
  leaf_node: boolean
  values: Values16
}

export interface Flags16 {}

export interface Values16 {
  value: number
}

export interface Pause {
  data_type: string
  flags: Flags17
  id: string
  leaf_node: boolean
  values: Values17
}

export interface Flags17 {}

export interface Values17 {
  value: boolean
}

export interface PauseTime {
  data_type: string
  flags: Flags18
  id: string
  leaf_node: boolean
  values: Values18
}

export interface Flags18 {}

export interface Values18 {
  max_value: number
  min_value: number
  value: number
}

export interface StartMoney {
  data_type: string
  flags: Flags19
  id: string
  leaf_node: boolean
  values: Values19
}

export interface Flags19 {}

export interface Values19 {
  max_value: number
  min_value: number
  value: number
}

export interface StartOnReady {
  data_type: string
  flags: Flags20
  id: string
  leaf_node: boolean
  values: Values20
}

export interface Flags20 {}

export interface Values20 {
  value: boolean
}

export interface TimeToConnect {
  data_type: string
  flags: Flags21
  id: string
  leaf_node: boolean
  link: string
  optional: boolean
  values: Values21
}

export interface Flags21 {}

export interface Values21 {
  max_value: number
  min_value: number
  value: number
}

export interface TimeoutMax {
  data_type: string
  display: Display4
  flags: Flags22
  id: string
  label: Label8
  leaf_node: boolean
  name: string
  values: Values22
}

export interface Display4 {
  priority: number
}

export interface Flags22 {}

export interface Label8 {
  en: string
}

export interface Values22 {
  max_value: number
  min_value: number
  value: number
}

export interface TimeoutTime {
  data_type: string
  display: Display5
  flags: Flags23
  id: string
  label: Label9
  leaf_node: boolean
  name: string
  values: Values23
}

export interface Display5 {
  priority: number
}

export interface Flags23 {}

export interface Label9 {
  en: string
}

export interface Values23 {
  max_value: number
  min_value: number
  value: number
}

export interface TvDelay {
  data_type: string
  flags: Flags24
  id: string
  leaf_node: boolean
  values: Values24
}

export interface Flags24 {}

export interface Values24 {
  max_value: number
  min_value: number
  value: number
}

export interface VoteKick {
  data_type: string
  flags: Flags25
  id: string
  leaf_node: boolean
  values: Values25
}

export interface Flags25 {}

export interface Values25 {
  value: boolean
}

export interface Stream {
  data_type: string
  flags: Flags26
  id: string
  leaf_node: boolean
  values: Values26
}

export interface Flags26 {}

export interface Values26 {
  value: boolean
}

export interface Location2 {
  class_name: string
  game_location_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface Party {
  partyId: string
  users: string[]
  premium: boolean
}

export interface VoteKick2 {
  requiredTags: string[]
}

export interface Teams {
  faction1: Faction1
  faction2: Faction2
}

export interface Faction1 {
  id: string
  name: string
  leader: string
  roster: Roster[]
  stats: Stats
  substituted: boolean
  avatar?: string
}

export interface Roster {
  id: string
  nickname: string
  gameId: string
  gameName: string
  memberships: string[]
  elo: number
  gameSkillLevel: number
  acReq: boolean
  partyId: string
  streaming: boolean
  avatar?: string
  regionalRank?: number
}

export interface Stats {
  winProbability: number
  skillLevel: SkillLevel
  rating: number
}

export interface SkillLevel {
  average: number
  range: Range
}

export interface Range {
  min: number
  max: number
}

export interface Faction2 {
  id: string
  name: string
  avatar?: string
  leader: string
  roster: Roster2[]
  stats: Stats2
  usersPermissions: UsersPermissions2
  substituted: boolean
  type?: string
  communityId?: string
}

export interface Roster2 {
  id: string
  nickname: string
  avatar?: string
  gameId: string
  gameName: string
  memberships: string[]
  elo: number
  gameSkillLevel: number
  acReq: boolean
  partyId: string
  streaming: boolean
  regionalRank?: number
}

export interface Stats2 {
  winProbability: number
  skillLevel: SkillLevel2
  rating: number
}

export interface SkillLevel2 {
  average: number
  range: Range2
}

export interface Range2 {
  min: number
  max: number
}

export interface UsersPermissions2 {
  "0540301d-4be0-45a0-baf8-dd39278c610d"?: string[]
  "4ca2158d-0a52-43af-84ba-9b8ca54870f1"?: string[]
  "22c0773e-5f76-423a-bcf7-8c0074218017"?: string[]
  "867aa836-e68e-4f37-b7e5-f3f247bc52ae"?: string[]
  "da04c54b-2ad8-464c-81b0-e100bcea7e92"?: string[]
  "98ee67f6-4281-4878-a077-0b0883353c2c"?: string[]
  "8968e06b-8c0f-41ba-8d24-4c63da44fd3d"?: string[]
  "53eace08-18f5-4efe-9914-534f3eacc218"?: string[]
  "97302991-1d40-4aea-bdfb-5f5217e44b32"?: string[]
  "3cb2c4c1-8636-466f-a11d-73cb4f8ba9c9"?: string[]
  "018806c2-fa0b-470a-bc84-475716183c11"?: string[]
  "cea5b17f-5da3-4896-b01c-638c391bb5b7"?: string[]
  "291e9acd-37a5-42d7-8a4d-c212ce50bdd3"?: string[]
  "b4604ab1-bab8-44d9-a9b4-4fdf439ddca3"?: string[]
  "09122ca4-111d-4c81-9156-ffc2776596e4"?: string[]
  "3858d888-71e5-4ef5-9352-d4255bc3c35d"?: string[]
  "6fb17716-ebac-4387-bd8a-5e4737b30d03"?: string[]
  "085e6d0e-4cca-426d-b5be-d1bd5604b9b0"?: string[]
  "70aca954-cfb0-40ef-ba6a-0eb155062fd7"?: string[]
  "d977b348-a957-462b-be11-a79f5167bc3f"?: string[]
}

export interface Voting {
  voted_entity_types: string[]
  location: Location3
  map: Map2
}

export interface Location3 {
  entities: Entity2[]
  pick: string[]
}

export interface Entity2 {
  class_name: string
  game_location_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface Map2 {
  entities: Entity3[]
  pick: string[]
}

export interface Entity3 {
  class_name: string
  game_map_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface Map3 {
  class_name: string
  game_map_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface SummaryResults {
  partial: boolean
  ascScore: boolean
  voteKicked: any[]
  disqualified: any[]
  afk: any[]
  leavers: any[]
  factions: Factions
}

export interface Factions {
  faction1: Faction12
  faction2: Faction22
}

export interface Faction12 {
  score: number
}

export interface Faction22 {
  score: number
}

export interface Result {
  partial: boolean
  ascScore: boolean
  voteKicked: any[]
  disqualified: any[]
  afk: any[]
  leavers: any[]
  factions: Factions2
}

export interface Factions2 {
  faction1: Faction13
  faction2: Faction23
}

export interface Faction13 {
  score: number
}

export interface Faction23 {
  score: number
}
