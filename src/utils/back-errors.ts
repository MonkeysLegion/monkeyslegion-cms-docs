export interface BackErrorResponse {
    status: number;
    response: {
        data: {
            errors: Record<string, string[]>;
        };
    };
}

export function backErrors(error: BackErrorResponse): void {
    document.querySelectorAll('.error-p').forEach((el) => {
        el.innerHTML = '';
    });

    if (error.status === 422) {
        const entries = Object.entries(error.response.data.errors as Record<string, string[]>);
        for (const [key, messages] of entries) {
            const normalizedKey = key.replace('.', '-');
            const p = document.querySelector(`.${normalizedKey}-error`);
            if (p !== null) {
                const firstMessage =
                    Array.isArray(messages) && typeof messages[0] === 'string'
                        ? messages[0]
                        : '';
                p.innerHTML = firstMessage ?? '';
            }
        }
    }
}
