export const randomInterval = () => {
    const sixHours = 1000 * 60 * 60 * 6;
    const fourDays = 1000 * 60 * 60 * 12 * 7;
    return Math.floor(Math.random() * (fourDays - sixHours + 1) + sixHours);
}