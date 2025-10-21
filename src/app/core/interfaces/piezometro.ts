export interface IPiezometroGet {
    piezometroId: number;
    nombrePiezometro: string;
    este: number;
    norte: number;
    elevacion: number;
    ubicacion: string;
    fecha_instalacion: string;
    estado: string;
}

export interface IMeasurementPiezometroGet {
    medicionId: number;
    fechaMedicion: string;
    cotaActualTerreno: number;
    cotaFondoPozo: number;
    cotaNivelPiezometro: number;
    profundidadActualPozo: number;
    longitudMedicion: number;
    comentario: string;
    piezometroId: number;
}

export interface IPiezometroPost {
    NombrePiezometro: string;
    Este: number;
    Norte: number;
    Elevacion: number;
    Ubicacion: string;
    StickUp: number;
    CotaActualBocaTubo: number;
    CotaActualTerreno: number;
    CotaFondoPozo: number;
    FechaInstalacion: string;
    DepositoId: number;
}

export interface IMesasurementPiezometroPost {
    LongitudMedicion: number;
    Comentario: string;
    FechaMedicion: string;
    PiezometerId: number;
}