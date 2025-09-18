export interface IDepositoGet {
    id: number;
    nombreDeposito: string;
    ubicacion: string;
    fechaCreacion: string;
}

export interface IDepositoPost {
    NombreDeposito: string;
    Ubicacion: string;
    FechaCreacion: string;
}