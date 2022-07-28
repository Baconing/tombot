export interface event {
    name: string;
    once: boolean;
    execute(...args: any): any;
}