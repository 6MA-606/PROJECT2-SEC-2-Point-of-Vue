import { hash } from "./plannetEncrypt"
import { getUserBy } from "./userManagement"

/**
 * Check if password is Secure or not
 * @param {String} password
 * @returns {Object} return object {
 *  isPasswordSecure: boolean,
 *  warning: Array
 * }
 */
export function checkPassword(password) {
    const warningMsg = []

    const isLengthValid = password.length >= 8
    const isMaxLengthValid = password.length <= 30
    const isCharacterValid = /^[\x20-\x7E]+$/.test(password) && password !== ''
    const haveLowerCase = /[\x61-\x7A]/.test(password)
    const haveUpperCase = /[\x41-\x5A]/.test(password)
    const haveDigit = /[\x30-\x39]/.test(password)
    const haveSymbol = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(password)

    if (!isLengthValid) warningMsg.push("At least 8 characters long")
    if (!isCharacterValid) warningMsg.push("Contain upper case, lower case, digits and special characters")
    if (!haveLowerCase) warningMsg.push("At least one lower case character")
    if (!haveUpperCase) warningMsg.push("At least one upper case character")
    if (!haveDigit) warningMsg.push("At least one digit")
    if (!haveSymbol) warningMsg.push("Password must contain at least one special character")
    if (!isMaxLengthValid) warningMsg.push("Password must be less than 30 characters long")
    return {
        isPasswordValid: isLengthValid && haveLowerCase && haveUpperCase && haveDigit && haveSymbol && isCharacterValid && isMaxLengthValid,
        warning: warningMsg,
        status: {
            isLengthValid,
            isMaxLengthValid,
            isCharacterValid,
            haveLowerCase,
            haveUpperCase,
            haveDigit,
            haveSymbol
        }
    }
}

export function validateNickname(nickname) {
    const warningMsg = []

    // const invalidSpecialChar = /[^A-Za-z0-9_-]/.test(nickname)
    const isLengthValid = nickname.length >= 3
    const isMaxLengthValid = nickname.length <= 20
    const isCharacterValid = /^[A-Za-z0-9_-]+$/.test(nickname) && nickname !== ''

    if (!isLengthValid) warningMsg.push("Display name must be at least 3 characters long")
    if (!isCharacterValid) warningMsg.push("Display name must contain only A-Z, a-z, 0-9, _ , -")
    if (!isMaxLengthValid) warningMsg.push("Display name must be less than 20 characters long")
    // if (invalidSpecialChar) warningMsg.push("Display name must contain only (A-Z, da-z, 0-9, _, -) characters")

    return {
        isNicknameValid: isLengthValid && isCharacterValid && isMaxLengthValid,
        warning: warningMsg,
        status: {
            isLengthValid,
            isCharacterValid,
            isMaxLengthValid
        }
    }
}

export function validateUsername(username) {
    const warningMsg = []

    const isLengthValid = username.length >= 3
    const isMaxLengthValid = username.length <= 20
    const isCharacterValid = /^[a-z0-9_-]+$/.test(username) && username !== ''

    if (!isLengthValid) warningMsg.push("Username must be at least 3 characters long")
    if (!isCharacterValid) warningMsg.push("Username must contain only a-z, 0-9, _ , -")
    if (!isMaxLengthValid) warningMsg.push("Username must be less than 20 characters long")

    return {
        isUsernameValid: isLengthValid && isCharacterValid && isMaxLengthValid,
        warning: warningMsg,
        status: {
            isLengthValid,
            isCharacterValid,
            isMaxLengthValid
        }
    }
}

export async function checkOldPassword(userId,oldPassword){
    const user = await getUserBy('id', userId)
    if (user.password ===  hash(oldPassword)) {
        return true
    } else {
        return false
    } 
}

export const validatePlanToPostOrActive = (plan) => {

    if (plan.title.length < 1) return 'Please enter title'
    if (plan.description.length < 1) return 'Please enter description'
    if (plan.dailyTasks.length < 1) return 'Please add daily tasks'

    for(let dailyTask of plan.dailyTasks){
        if (dailyTask.title.length < 1) return 'Please enter daily task title'
        if (dailyTask.hourlyTasks.length < 1) return 'Please add hourly tasks'

        for(let hourlyTask of dailyTask.hourlyTasks){
            if (hourlyTask.header.length < 1) return 'Please enter hourly task header'
            if (hourlyTask.start === '' || hourlyTask.end === '') return 'Please enter start and end time'
            if (hourlyTask.todos.length < 1) return 'Please enter at least one todo in each hourly task'
        }
    }

    return ''
}