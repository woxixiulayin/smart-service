const getClassName = Class => String.prototype.toLocaleLowerCase.call(Class.name)

const getClassNameOfInstance = instance => String.prototype.toLocaleLowerCase.call(instance.__proto__.constructor.name)

export {
    getClassName
}