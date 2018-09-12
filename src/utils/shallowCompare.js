const onwProps = Object.prototype.hasOwnProperty

function is(a, b) {
    if (a === b) {
        return a !== 0 || 1/a === 1/b
    } else {
        return a !== a && b !== b
    }
}

export default function shallowCompare(objA, objB) {
    if (is(objA, objB)) {
        return true
    }

    if (typeof objA !== 'object' || objA === null
    || typeof objB !== 'object' || objB === null
    ) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
        return false
    }

    for (const key of keysA) {
        if (!onwProps.call(objB, key) || objA[key] !== objB[key]) {
            return false
        }
    }

    return true
}