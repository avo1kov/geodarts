import { LngLat } from "mapbox-gl"

export interface City {
    name: string;
    id: number;
    ll: LngLat;
    wikilink?: string;
    radius?: number;
    attempted?: {
        direction: number;
        distanceKm: number;
    };
}
