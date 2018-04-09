export class Line {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export class Pin {
    nameMsg: {
        name: string;
        nameX: number;
        nameY: number;
        nameDisplay: boolean;
    };
    desMsg: {
        des: string;
        desX: number;
        desY: number;
        desDisplay: boolean;
    }
    outsideEdge: string;
    footSite: {
        siteX: number;
        siteY: number;
    };
    rotation: number;
    length: number;
}

export class Arc {
    oX: number;
    oY: number;
    radius: number;
    startAngle: number;
    sweepAngle: number;
    width: number;
}

export class Text {
    site: {
        siteX: number;
        siteY: number;
    };
    content: string;
    rotation: number;
}
export class Symbol {
    nameMsg: {
        name: string;
        nameX: number;
        nameY: number;
    };
    refDesMsg: {
        refDes: string;
        refDesX: number;
        refDesY: number;
    };
    site: {
        siteX: number;
        siteY: number;
    };
    rotation: number;
    lines: Line[];
    pins: Pin[];
    arcs: Arc[];
    texts: Text[];
}
export class ElementsSet {
    linesMsg: {
        lines: Line[];
        linesNum: number;
    };
    symbolsMsg: {
        symbols: Symbol[];
        symbolsNum: number;
    }
}