const help = require('../helpers/help');
const orders = {};

orders.patch = (fields, IdPedido) => help.d$().update('traPedidos', fields, { IdPedido }).then(data => data).catch(err => err);

orders.updatePaidOrders = ({ ID }) => help.d$().query(`
UPDATE traPedidos SET IdEstatusPedido = 3 WHERE IdFactura = ? AND IdEstatusPedido in (2)`, [ID]);


orders.getPrepaidOrdersWithoutBill = IdERP => (
    help.d$().query(`
    SELECT sum(fn_CalcularTotalPedido(IdPedido)) * 1.16 AS totalDebt
    FROM traPedidos P
    INNER JOIN traEmpresas dist on dist.IdEmpresa = P.IdEmpresaDistribuidor
    WHERE IdERP = ? AND IdFormaPago = 4 and Facturado != 1 and IdEstatusPedido not in (1,6);
    `, [IdERP])
      .then(result => result.data[0])
);

module.exports = orders;
