export class Line {
    name: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export class Pin {
    pinNum: {
        pinNum: string;
        pinNumX: number;
        pinNumY: number;
    }
    outsideRadius: number = 25;
    footX: number;
    footY: number;
    rotation: number;
    length: number;
}

export class NHeader {
    name: {
        name: string;
        nameX: number;
        nameY: number;
    };
    refDes: {
        refDesX: number;
        refDesY: number;
    }
    headerX: number;
    headerY: number;
    headerRotation: number;
    lines: Line[];
    pins: Pin[];
}
export class ElementsSet {
    lines: Line[];
    linesNum: number;
    nHeaders: NHeader[];
    nHeadersNum: number;
}