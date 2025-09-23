import { Card, Flex, Text, Avatar, Box, IconButton } from "@radix-ui/themes";
import { useState, useEffect } from "react";

interface PlayerCardProps {
  avatar: string;
  nickname: string;
  skill_level: string;
  countryFlag?: string;
  status?: string;
  createdAt: string;
  match_id: string;
}

export function PlayerCard({ avatar, nickname, skill_level, countryFlag, status, createdAt, match_id }: PlayerCardProps) {

  const getElapsedTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return `${diffSec}s ago`;
  };

  const ElapsedTime: React.FC<{ dateString: string }> = ({ dateString }) => {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
      const update = () => {
        setElapsed(getElapsedTime(dateString));
      };

      update();
      const interval = setInterval(update, 60_000);

      return () => clearInterval(interval);
    }, [dateString]);

    return <span>{elapsed}</span>;
  };

  return (
    <Card className={`flex flex-row items-center bg-[#111] rounded-xl p-4 w-48 shadow-lg h-70 border-2 ${status == "ONGOING" ? "border-amber-600" : status == "READY" ? "border-green-500" : "border-yellow-300"}`}>
      <Flex align="center" direction="column" gap="3">
        <Flex align="center" justify="end" direction="row" gap="3">
          <ElapsedTime dateString={createdAt} />
          <IconButton color="gray" variant="surface" highContrast onClick={() => window.open(`https://www.faceit.com/en/cs2/room/${match_id}`, '_blank')}>
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
              </path>
            </svg>
          </IconButton>
        </Flex>
        <Avatar className="inline-flex rounded-full overflow-hidden"
          size="6" radius="full"
          src={avatar} alt={nickname} fallback={nickname} />
        <Flex align="center" direction="column" className="mt-3 text-center" gap="3">
          <Text as="div" size="4" weight="bold"> {nickname} </Text>
          <Avatar size="2"
            src={`https://faceitanalyser.com/static/stats/i/levels/lvl${skill_level}.svg`}
            radius="full"
            fallback="T" />
          {countryFlag && (
            <img src={countryFlag}
              alt="flag"
              className="inline-block w-5 h-3 mt-1" />
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
