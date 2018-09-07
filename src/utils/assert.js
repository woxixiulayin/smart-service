export default function assert(condition, errorMessage) {
    if (!condition) {
        throw new Error(`[assert] ${errorMessage}`)
    }
}
