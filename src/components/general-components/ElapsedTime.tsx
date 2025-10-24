import { useState, useEffect } from "react";
import { getElapsedTimeMMSS } from "../../util/function_utils";
import { Text } from "@radix-ui/themes";


export function ElapsedTime({ startTime }: { startTime: string }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Text size="2">{ getElapsedTimeMMSS(startTime) }</Text>
    );
}
