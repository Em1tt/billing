export const serializeNonPOJOs = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
}