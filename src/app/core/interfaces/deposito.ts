export interface IDepositoGet {
    id: number;
    nombreDeposito: string;
    ubicacion: string;
    fechaCreacion: string;
    zonaUtm: number;
    coordenadaEste: number;
    coordenadaNorte: number;
}

export interface IDepositoPost {
    NombreDeposito: string;
    Ubicacion: string;
    FechaCreacion: string;
    ZonaUtm: number;
    CoordenadaEste: number;
    CoordenadaNorte: number;
}