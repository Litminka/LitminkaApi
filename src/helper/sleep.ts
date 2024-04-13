export default function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        return setTimeout(resolve, time);
    });
}
