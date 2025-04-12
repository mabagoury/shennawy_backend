export interface IApartment {
    title: string;
    description?: string;
    location: string;
    price: number;
    number: string;
    project?: string;
    thumbnail: string;
    images?: string[];
}