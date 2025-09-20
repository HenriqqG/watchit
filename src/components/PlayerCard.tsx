import { Card, Flex, Text, Avatar } from "@radix-ui/themes";
import { useState, useEffect } from "react";

interface PlayerCardProps {
  avatar: string;
  nickname: string;
  skill_level: string;
  countryFlag?: string;
  status?: string;
  createdAt: string
}

export function PlayerCard({ avatar, nickname, skill_level, countryFlag, status, createdAt }: PlayerCardProps) {

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
        <ElapsedTime dateString={createdAt} />
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
