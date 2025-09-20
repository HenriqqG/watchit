import { Card, Flex, Avatar, Text, Box } from "@radix-ui/themes";

interface WatchedPlayerCardProps {
  avatar: string;
  nickname: string;
  country: string;
  skillLevel: number;
  onRemoveFromList: (nickname: string) => void;
}

export function WatchedPlayerCard({ avatar, nickname, country, skillLevel, onRemoveFromList }: WatchedPlayerCardProps) {
  return (
    <Card className="w-[500px] h-[70px] p-3 ">
      <Flex gap="3" align="center">
        <button className="text-white font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center me-2 cursor-pointer" onClick={() => onRemoveFromList(nickname)}>
          <svg
            className="w-3.5 h-3.5 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 21">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6" />
          </svg>
        </button>
        <Avatar size="4" src={avatar} radius="full" fallback={nickname[0] ?? "T"} />
        <Flex align="center" justify="between" direction="row" className="w-full">
          <Text as="div" size="2" weight="bold">
            {nickname}
          </Text>
          <Box>
            <Flex direction="row" gap="2">
              <img
                width="18"
                height="18"
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
                alt={country}
              />
              <Avatar
                size="2"
                src={`https://faceitanalyser.com/static/stats/i/levels/lvl${skillLevel}.svg`}
                radius="full"
                fallback="T"
              />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}
