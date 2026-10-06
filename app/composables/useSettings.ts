export const useSettings = () => useFetch<Settings>('/api/settings', { key: 'settings' })
