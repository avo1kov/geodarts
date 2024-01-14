export interface City {
    name: string;
    id: string;
    ll: [number, number];
    wikilink?: string;
    radius?: number;
    attempted?: {
        direction: number;
        distanceKm: number;
    };
}
