export function addMonths(date: Date, months: number): string {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setHours(0, 0, 0, 0);
    return newDate.toISOString().split("T")[0];
}