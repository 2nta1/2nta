export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export async function fetchClients(): Promise<Client[]> {
    try {
        const res = await fetch('/api/company/clients');
        if (!res.ok) {
            throw new Error('Failed to fetch clients');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
}
