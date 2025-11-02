import { Card, Flex, Avatar, Text, Box } from "@radix-ui/themes";
import svgs from "../../assets/faceitLevels/faceitLevels";

interface WatchedPlayerCardProps {
  avatar: string;
  nickname: string;
  country: string;
  skillLevel: number;
  onRemoveFromList: (nickname: string) => void;
  index?: number;
}

export function WatchedPlayerCard({
  avatar,
  nickname,
  country,
  skillLevel,
  onRemoveFromList
}: WatchedPlayerCardProps) {
  const avatarSrc = avatar ? `${avatar}` : "";
  const flagSrc = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;
  const skillIcon = svgs[`./lvl${skillLevel}.svg`];

  return (
    <Card className="w-full h-[70px] p-3 hover:bg-[#1f1f1f] transition-colors">
      <Flex gap="3" align="center">
        <button
          className="text-white font-medium rounded-lg text-sm px-2 py-2 inline-flex items-center me-2 hover:bg-[#2a2a2a] transition-colors"
          onClick={() => onRemoveFromList(nickname)}>
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

        <Avatar size="4" radius="full" fallback={nickname[0] ?? "T"} src={avatarSrc}
            alt={nickname}
            width={56}
            height={56}
            loading={"lazy"}
            decoding="async"
            className="rounded-full object-cover bg-[#222]">
        </Avatar>

        <Flex align="center" justify="between" direction="row" className="w-full">
          <Text as="div" size="2" weight="bold">
            {nickname}
          </Text>

          <Box>
            <Flex direction="row" gap="2" align="center">
              <img
                width="18"
                height="18"
                src={flagSrc}
                alt={country}
                loading="lazy"
                decoding="async" />
              <Avatar size="2" radius="full" fallback="T" src={`${skillIcon}`}
                  alt={`Level ${skillLevel}`}
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async">
              </Avatar>

              <button
                className="hover:cursor-pointer border-zinc-700 border p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                onClick={() =>
                  window.open(`https://www.faceit.com/en/players/${nickname}`, "_blank")
                }>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738"
                    fill="currentColor" />
                </svg>
              </button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}
