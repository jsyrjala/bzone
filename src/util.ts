export const minValue = (value: number, min: number) => {
    if (Math.abs(value) < min) {
        return 0
    }
    return value;
}