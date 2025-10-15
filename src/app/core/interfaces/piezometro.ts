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
}

export interface IMesasurementPiezometroPost {
    LongitudMedicion: number;
    Comentario: string;
    FechaMedicion: string;
    PiezometerId: number;
}