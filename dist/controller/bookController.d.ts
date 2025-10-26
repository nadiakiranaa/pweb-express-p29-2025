import { Request, Response } from "express";
export declare const addBookController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllBookController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookDetailController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBooksByGenreController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateBookController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBookController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
