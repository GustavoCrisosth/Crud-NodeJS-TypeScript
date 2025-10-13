
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';


const validate =
    (schema: ZodObject<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {

                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });

                next();
            } catch (error: any) {

                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: 'Erro de validação.',
                        errors: error.issues,
                    });
                }

                return res.status(500).json({ message: 'Erro interno no servidor.' });
            }
        };

export default validate;