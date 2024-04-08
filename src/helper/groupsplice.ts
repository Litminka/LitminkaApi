export default function groupArrSplice(arr: any[], size: number) {
    const output: any[] = [];
    for (let i = 0; i < arr.length; i += size) {
        output.push(arr.slice(i, i + size));
    }
    return output;
}