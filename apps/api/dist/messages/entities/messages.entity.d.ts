export declare class Message {
    id: string;
    phone?: number;
    sender_type?: string;
    operator_id?: string;
    content?: string;
    status?: string;
    actions?: Action[];
    outcome?: string;
    reason?: string;
    job_type?: string;
    urgency?: number;
}
export interface Action {
    type?: string;
    result?: string;
    error?: string | null;
}
