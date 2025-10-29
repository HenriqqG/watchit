import type { VersionResponse } from "../types/responses/VersionResponse";

const API_URL = import.meta.env.VITE_API_URL;

export function getProjectVersion() : Promise<VersionResponse | undefined> {
    return new Promise<VersionResponse | undefined>((resolve) => {
        fetch(`${API_URL}/healthcheck/version`)
        .then(async (response) => {
            if (!response.ok) {
                console.error(await response.text());
                resolve(undefined);
                return;
            }
            const versionResponse = (await response.json()) as VersionResponse;
            resolve(versionResponse);
        });
    });
}