import z from "zod";

const createBuyerValidationSchema = z.object({
    password: z.string(),
    buyer: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        address: z.string().optional()
    })
});

export const UserValidation = {
    createBuyerValidationSchema
}