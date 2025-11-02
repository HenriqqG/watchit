import { Card, Flex, Text, Avatar } from "@radix-ui/themes";
import svgs from "../../assets/faceitLevels/faceitLevels";

interface PlayerSearchResultCardProps {
  item: any;
  onSelect: (item: any) => void;
  index?: number;
}

export function PlayerSearchResultCard({ item, onSelect }: PlayerSearchResultCardProps) {
  const avatarSrc = item.avatar ? `${item.avatar}` : "";
  const flagSrc = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.country}.svg`;
  const skillIcon = svgs[`./lvl${item.games[0]?.skill_level}.svg`];

  return (
    <Card
      className="max-h-[60px] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
      onClick={() => onSelect(item)}
    >
      <Flex gap="3" align="center">
        <Avatar size="3" radius="full" fallback={item.nickname?.[0] ?? "T"} src={avatarSrc}
            alt={item.nickname}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="rounded-full object-cover bg-[#222]">
        </Avatar>

        <Flex align="center" justify="between" direction="row" className="w-full">
          <Text as="div" size="2" weight="bold">
            {item.nickname}
          </Text>

          <Flex direction="row" gap="3" align="center">
            <img
              width="18"
              height="18"
              src={flagSrc}
              alt={item.country}
              loading="lazy"
              decoding="async"
              className="rounded-sm" />
            <Avatar size="2" radius="full" fallback="T" src={`${skillIcon}`}
                alt={`Level ${item.games[0]?.skill_level}`}
                width={24}
                height={24}
                loading="lazy"
                decoding="async">
            </Avatar>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
