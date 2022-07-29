export type Punishments = {
    id: number;
    userId: string;
    serverId: string;
    type: string;
    isActive: boolean;
    actor: string;
    reason: string;
    unbanActor: string | null;
    unbanReason: string | null;
    createdAt: EpochTimeStamp;
}