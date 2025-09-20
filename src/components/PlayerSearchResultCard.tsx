import { Card, Flex, Text, Avatar } from "@radix-ui/themes";

interface PlayerSearchResultCardProps {
  item: any;
  onSelect: (item: any) => void;
}

export function PlayerSearchResultCard({ item, onSelect }: PlayerSearchResultCardProps) {

  return (
    <Card className=" max-h-[60px] cursor-pointer" onClick={() => onSelect(item)}>
      <Flex gap="3" align="center">
        <Avatar size="3"
          src={item.avatar}
          radius="full"
          fallback="T" />
        <Flex align="center" justify="between" direction="row" className="w-full">
          <Text as="div" size="2" weight="bold"> {item.nickname} </Text>
          <Flex direction="row" gap="3">
            <img width="18" height="18"
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item.country}.svg`} />
            <Avatar size="2"
              src={`https://faceitanalyser.com/static/stats/i/levels/lvl${item.games[0].skill_level}.svg`}
              radius="full"
              fallback="T" />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
