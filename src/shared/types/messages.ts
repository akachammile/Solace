export interface Messages {
    role: 'user' | 'assistant' | 'system'
    content: string
    status: 'pending' | 'completed' | 'error'
}


export interface ToolCallMessage extends Messages {
    toolCall: {
        toolName: string
        args: Record<string, unknown>
    }
}

export interface ReasoningMessage extends Messages {
    reasoning: {
        thought: string
        plan: string
        criticism: string
        speak: string
    }
}