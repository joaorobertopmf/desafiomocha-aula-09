import { describe, it } from 'mocha';
import assert from 'node:assert';
import ServicoDePagamento from '../src/servicoDePagamento.js';

describe('Suite de testes relacionado ao serviço de pagamento', () => {
    it('Realizar pagamento com valor R$ 99.99 deve retornar categoria "padrão"', () => {
        // Arrange
        const servicoDePagamento = new ServicoDePagamento();
        const valorPagamento = 99.99;
        const categoriaEsperada = 'padrão';

        // Act
        servicoDePagamento.realizarPagamento('123456789', 'Empresa X', valorPagamento);

        // Assert
        assert.strictEqual(servicoDePagamento.consultarUltimoPagamento().categoria, categoriaEsperada);        
    });

    it('Realizar pagamento com valor R$ 100.00 deve retornar categoria "padrão"', () => {
        // Arrange
        const servicoDePagamento = new ServicoDePagamento();
        const valorPagamento = 100.00;
        const categoriaEsperada = 'padrão';

        // Act
        servicoDePagamento.realizarPagamento('123456789', 'Empresa X', valorPagamento);

        // Assert
        assert.strictEqual(servicoDePagamento.consultarUltimoPagamento().categoria, categoriaEsperada);        
    });

    it('Realizar pagamento com valor R$ 100.01 deve retornar categoria "cara"', () => {
        // Arrange
        const servicoDePagamento = new ServicoDePagamento();
        const valorPagamento = 100.01;
        const categoriaEsperada = 'cara';

        // Act
        servicoDePagamento.realizarPagamento('123456789', 'Empresa X', valorPagamento);

        // Assert
        assert.strictEqual(servicoDePagamento.consultarUltimoPagamento().categoria, categoriaEsperada);
    });

    it('Consultar último pagamento retorna apenas o último de múltiplos pagamentos', () => {
        // Arrange
        const servicoDePagamento = new ServicoDePagamento();

        // Act
        servicoDePagamento.realizarPagamento('111111111', 'Empresa A', 50.00);
        servicoDePagamento.realizarPagamento('999999999', 'Empresa B', 200.00);

        // Assert
        const ultimo = servicoDePagamento.consultarUltimoPagamento();
        assert.strictEqual(ultimo.codigoBarras, '999999999');
        assert.strictEqual(ultimo.empresa, 'Empresa B');
        assert.strictEqual(ultimo.valor, 200.00);
        assert.strictEqual(ultimo.categoria, 'cara');
    });

    it('Consultar último pagamento sem nenhum pagamento realizado retorna undefined', () => {
        // Arrange
        const servicoDePagamento = new ServicoDePagamento();

        // Assert
        assert.strictEqual(servicoDePagamento.consultarUltimoPagamento(), undefined);
    });

    it('Realizar pagamento armazena todas as propriedades corretamente', () => {
        // Arrange
        const servicoDePagamento = new ServicoDePagamento();

        // Act
        servicoDePagamento.realizarPagamento('123456789', 'Empresa X', 50.00);

        // Assert
        const pagamento = servicoDePagamento.consultarUltimoPagamento();
        assert.strictEqual(pagamento.codigoBarras, '123456789');
        assert.strictEqual(pagamento.empresa, 'Empresa X');
        assert.strictEqual(pagamento.valor, 50.00);
        assert.strictEqual(pagamento.categoria, 'padrão');
    });

    // Testes negativos para o codigoBarras
    it('Realizar pagamento com codigoBarras vazio deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('', 'Empresa X', 50.00),
            { message: 'Código de barras inválido' }
        );
    });

    it('Realizar pagamento com codigoBarras null deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento(null, 'Empresa X', 50.00),
            { message: 'Código de barras inválido' }
        );
    });

    it('Realizar pagamento com codigoBarras undefined deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento(undefined, 'Empresa X', 50.00),
            { message: 'Código de barras inválido' }
        );
    });

    it('Realizar pagamento com codigoBarras contendo apenas espaços deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('   ', 'Empresa X', 50.00),
            { message: 'Código de barras inválido' }
        );
    });

    // Testes negativos — empresa
    it('Realizar pagamento com empresa vazia deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('123456789', '', 50.00),
            { message: 'Empresa inválida' }
        );
    });

    it('Realizar pagamento com empresa null deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('123456789', null, 50.00),
            { message: 'Empresa inválida' }
        );
    });

    // Testes negativos — valor
    it('Realizar pagamento com valor zero deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('123456789', 'Empresa X', 0),
            { message: 'Valor inválido' }
        );
    });

    it('Realizar pagamento com valor negativo deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('123456789', 'Empresa X', -50.00),
            { message: 'Valor inválido' }
        );
    });

    it('Realizar pagamento com valor NaN deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('123456789', 'Empresa X', NaN),
            { message: 'Valor inválido' }
        );
    });

    it('Realizar pagamento com valor como string deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento('123456789', 'Empresa X', '100'),
            { message: 'Valor inválido' }
        );
    });

    it('Realizar pagamento sem argumentos deve lançar erro', () => {
        const servicoDePagamento = new ServicoDePagamento();
        assert.throws(
            () => servicoDePagamento.realizarPagamento(),
            { message: 'Código de barras inválido' }
        );
    });
});