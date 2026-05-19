class ServicoDePagamento {

    constructor() {
        this.pagamentos = [];
    }

    realizarPagamento(codigoBarras, empresa, valor) {
        if (!codigoBarras || typeof codigoBarras !== 'string' || codigoBarras.trim() === '') {
            throw new Error('Código de barras inválido');
        }
        if (!empresa || typeof empresa !== 'string' || empresa.trim() === '') {
            throw new Error('Empresa inválida');
        }
        if (typeof valor !== 'number' || isNaN(valor) || valor <= 0) {
            throw new Error('Valor inválido');
        }

        this.pagamentos.push({
            codigoBarras: codigoBarras,
            empresa: empresa,
            valor: valor,
            categoria: valor > 100.00 ? 'cara' : 'padrão'
        });
    }

    consultarUltimoPagamento() {
        return this.pagamentos.at(-1);
    }
}

export default ServicoDePagamento;