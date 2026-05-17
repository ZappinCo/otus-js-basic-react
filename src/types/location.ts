export interface Location {
    city?: string;
    lat?: number;
    lon?: number;
    error: Error|null;
}