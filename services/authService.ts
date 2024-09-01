import User, {IUser} from "../model/userModel";
import bcrypt from 'bcryptjs';
import {sendConfirmMail} from "../helpers/customHelpers";
import verifyToken from "../middlewares/jwtMiddleware";

export const createUser = async (userData: Omit<IUser, any>): Promise<IUser> => {
    try {
        const user = new User(userData);
        await sendConfirmMail(user.email,user.name, user.verificationToken)
        return await user.save();
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('User creation failed');
    }
};

/**
 * Finds a user in the database based on the provided email.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<IUser | null>} - A promise that resolves with the found user or null if not found.
 */
export const findByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({email});
};

/**
 * Finds a user in the database based on the provided mobile number.
 * @param {string} mobileNumber - The mobile number of the user to find.
 * @returns {Promise<IUser | null>} - A promise that resolves with the found user or null if not found.
 */
export const findByMobileNumber = async (mobileNumber: string): Promise<IUser | null> => {
    return User.findOne({mobileNumber});
};

/**
 * Finds a user in the database based on the provided username.
 * @param {string} username - The username of the user to find.
 * @returns {Promise<IUser | null>} - A promise that resolves with the found user or null if not found.
 */
export const findByUsername = async (username: string): Promise<IUser | null> => {
    return User.findOne({username});
};

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compares the candidate password with the hashed password using bcrypt.
 * @async
 * @param {string} candidatePassword - The candidate password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the passwords match.
 */
export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(candidatePassword, hashedPassword);
};


/**
 * Validates a password by comparing it with a hashed password.
 * @param {string} password - The password to validate.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating if the password is valid.
 */
export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await comparePassword(password, hashedPassword);
};

export const confirmVerificationToken = async (token: string, userID: string): Promise<boolean> => {
    if (!token) {
        return false
    }
    try {
        const user: IUser | null = await User.findById(userID);
        if (!user) {
            return false
        }
        if (token === user.verificationToken) {
            await User.updateOne({ _id: userID }, { $set: { verified: true, verificationToken:""} });
            return true;
        } else {
            return false
        }
    } catch (err) {
        throw new Error(`Verification failed: ${(err as Error).message}`);
    }
};