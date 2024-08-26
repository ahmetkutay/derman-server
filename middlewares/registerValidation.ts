import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import {Request, Response, NextFunction} from "express";
import {findByEmail, findByUsername, findByMobileNumber} from "../services/authService";

const ajv = new Ajv({ allErrors: true, $data: true });
addFormats(ajv);
addErrors(ajv);
ajv.addFormat("mobileNumber", /^\d{10}$/);

const schema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 6,
            errorMessage: "Username must be at least 6 characters long",
        },
        first_name: {
            type: "string",
            maximum: 100,
            errorMessage: "First name must be between 1 and 100 characters long",
        },
        last_name: {
            type: "string",
            maximum: 100,
            errorMessage: "Last name must be between 1 and 100 characters long",
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 100,
            errorMessage: "Password must be between 8 and 100 characters long",
        },
        email: {
            type: "string",
            format: "email",
            errorMessage: "Invalid email address",
        },
        phone: {
            type: "string",
            format: "mobileNumber",
            errorMessage: "Invalid mobile number",
        },
        birthdate: {
            type: "string",
            errorMessage: "Invalid birthdate",
        },
        gender: {
            type: "string",
            errorMessage: "Invalid gender",
        }
    },
    required: ["username", "first_name", "last_name", "email", "phone", 'birthdate'],
    additionalProperties: false,
};

/**
 * Middleware function to validate the request body against a given schema using the AJV library.
 *
 * @param {Request} req - The request object containing the data to be validated.
 * @param {Response} res - The response object used to send a response back to the client.
 * @param {NextFunction} next - A function to call to pass control to the next middleware function.
 * @returns {void}
 */
function ajvMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const data = req.body;
    if(data === undefined) return res.status(401).json({ message: 'No found data' });
    const isValid = ajv.validate(schema, data);

    if (!isValid) {
        const errors = ajv.errors?.map(error => error.message);
        return res.status(400).json({ errors });
    }
    next();
}

/**
 * Checks if a user with the given email, username, or mobile number already exists in the database.
 * If any of these fields already exist, it returns a response with the corresponding error message.
 *
 * @param {Request} req - The request object containing the user data.
 * @param {Response} res - The response object to send the error message.
 * @param {NextFunction} next - The next middleware function to call.
 * @returns {void}
 */

async function checkExistingUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const existingEmail = await findByEmail(req.body.email);
    const existingUsername = await findByUsername(req.body.username);
    const existingMobileNumber = await findByMobileNumber(req.body.phone); // Assuming you meant `phone` here.
    if (existingEmail || existingUsername || existingMobileNumber) {
        let errorMessage = "";

        if (existingEmail) {
            errorMessage = "The given email address already exists!";
        } else if (existingUsername) {
            errorMessage = "The given username already exists!";
        } else if (existingMobileNumber) {
            errorMessage = "The given mobile number already exists!";
        }

        return res.status(400).json({ error: errorMessage });
    }
    next();
}

export { ajvMiddleware, checkExistingUser };