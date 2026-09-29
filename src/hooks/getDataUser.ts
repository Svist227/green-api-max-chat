'use client';

import { useQuery } from '@tanstack/react-query';

async function getUsers(): Promise<Chat[]> {
    const res = await fetch('/api/chats', {
        credentials: 'same-origin',
        cache: 'no-store',
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Не удалось загрузить чаты');
    }

    return data;
}

export const useGetDataUser = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });
};
