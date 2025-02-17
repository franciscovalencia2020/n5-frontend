export const formatDateToEST = (dateString: string) =>
    new Date(dateString).toLocaleString('es-ES', { timeZone: 'America/New_York' });