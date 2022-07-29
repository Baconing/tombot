export class BotError extends Error {
    public type: string | null;
    public code: number | string | null;
    constructor(message: string, type: string | null = null, code: number | string | null = null) {
        super(message);
        this.type = type;
        this.code = code;
    }
}