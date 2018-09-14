const getClassName = Class => {
    return String.prototype.toLocaleLowerCase.call(Class.name[0]) + Class.name.slice(1)
}

export default getClassName