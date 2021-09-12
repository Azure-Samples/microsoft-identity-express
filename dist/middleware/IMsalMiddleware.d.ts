import { Request, Response, NextFunction } from "express";
export interface IMsalMiddleware {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleRedirect(req: Request, res: Response, next: NextFunction): Promise<void>;
    acquireToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    acquireTokenOnBehalfOf(req: Request, res: Response, next: NextFunction): Promise<void>;
    isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    isAuthorized(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    hasAccess(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}
