import {findByMobileNumber, findByUsername, findByEmail} from "../services/authService";

/**
 * Checks if a user already exists for login by searching for their email, username, or mobile number in the database.
 *
 * @param {object} userData - An object containing the user's email, username, and mobile number.
 * @returns {object|undefined} - The user object if a user is found, otherwise undefined.
 */
async function checkExistingUserForLogin(userData: string | undefined): Promise<object | undefined> {
    if(userData === undefined) return undefined;
    const findUserEmail = userData ? await findByEmail(userData) : null;
    const findUsername = userData ? await findByUsername(userData) : null;
    const findUserMobileNumber = userData ? await findByMobileNumber(userData) : null;

    if (findUserEmail) {
        return findUserEmail;
    } else if (findUsername) {
        return findUsername;
    } else if (findUserMobileNumber) {
        return findUserMobileNumber;
    }

    return undefined;
}

export default checkExistingUserForLogin;