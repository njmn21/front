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

export interface IHitoGet {
    hitoId: number;
    nombreHito: string;
    depositoId: number;
    nombreDeposito: string;
}

export interface IHitoPost {
    NombreHito: string;
    DepositoId: number;
}

export interface IMedidaGet {
    medicionId: number;
    este: number;
    norte: number;
    elevacion: number;
    horizontalAbsoluto: number;
    verticalAbsoluto: number;
    totalAbsoluto: number;
    acimutAbsoluto: number;
    buzamientoAbsoluto: number;
    horizontalRelativo: number;
    verticalRelativo: number;
    totalRelativo: number;
    acimutRelativo: number;
    buzamientoRelativo: number;
    horizontalAcumulado: number;
    velocidadMedia: number;
    inversaVelocidadMedia: number;
    fechaMedicion: string;
    hitoId: number;
    nombreHito: string;
}

export interface IMedidaPost {
    Este: number;
    Norte: number;
    Elevacion: number;
    FechaMedicion: string;
    HitoId: number;
    EsBase: boolean;
}

export interface IMaxMedidaGet {
    totalAbsoluto: number;
    acimutAbsoluto: number;
    buzamientoAbsoluto: number;
    velocidadMedia: number;
    fechaMedicion: string;
}