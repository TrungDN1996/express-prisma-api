declare namespace Express {
    interface Request {
        auth?: {
            user?: {
                id: number
            }
        }
    }
}