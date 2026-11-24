export const formatTime = (timestamp: number) => {
    const seconds = Math.floor(timestamp / 1000);
    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        if (hours < 1) {
            return "less than an hour"
        };
        return `${hours} hour${hours != 1 ? "s" : ""}`;
    };
    const days = Math.floor(seconds / 86400);
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (months == 0) return `${days} days`;
    if (remainingDays == 0) return `${months} month${months != 1 ? "s" : ""}`;
    return `${months} month${months != 1 ? "s" : ""} and ${remainingDays} day${remainingDays != 1 ? "s" : ""}`;
};