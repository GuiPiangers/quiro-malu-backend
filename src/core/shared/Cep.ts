import { ApiError } from "../../utils/ApiError";

export class Cep {
    constructor(readonly value: string) {
        const pattern = /^[0-9]{5}-[0-9]{3}$/;
        if (!pattern.test(value))
            throw new ApiError("CEP fora do padrão esperado", 400);
    }

}