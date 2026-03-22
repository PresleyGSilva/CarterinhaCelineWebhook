const payload = {
  "event": "TRANSACTION_PAID",
  "token": "ish0me01",
  "offerCode": "H9OKE6T",
  "client": {
    "id": "cmn1373ew00041rpkcak3b3y3",
    "name": "Anderson S Calixto ",
    "email": "ateliercalixtomakeup@gmail.com",
    "phone": "+5521982751661",
    "cpf": "029.054.257-09",
    "cnpj": null,
    "address": null
  },
  "transaction": {
    "id": "cmn1373m8000c1rpkkwv5auuh",
    "identifier": "app.vekssell.com.br-ORDER-cmn1373jo00061rpk4m0lcd9w",
    "status": "COMPLETED",
    "paymentMethod": "PIX",
    "originalAmount": 39.9,
    "originalCurrency": "BRL",
    "currency": "BRL",
    "exchangeRate": 1,
    "amount": 39.9,
    "installments": 1,
    "createdAt": "2026-03-22T01:37:20.112Z",
    "payedAt": "2026-03-22T01:38:32.989Z",
    "boletoInformation": null,
    "pixInformation": {
      "id": "cmn137584000m1rpk7k7omn4m",
      "qrCode": "00020101021226820014br.gov.bcb.pix2560pix.stone.com.br/pix/v2/a3a231f5-30e2-4734-b8f7-08a156e0dcf5520400005303986540539.905802BR5925Pagar Me Instituicao De P6014RIO DE JANEIRO622905258902edb46b88b93763a6c48086304F61C",
      "description": null,
      "image": "https://api.pagar.me/core/v5/transactions/tran_zn7K4KLS6To05vMJ/qrcode?payment_method=pix",
      "expiresAt": null,
      "endToEndId": null,
      "transactionId": "cmn1373m8000c1rpkkwv5auuh",
      "createdAt": "2026-03-22T01:37:22.202Z",
      "updatedAt": "2026-03-22T01:37:22.202Z"
    }
  },
  "subscription": null,
  "orderItems": [
    {
      "id": "cmn1373jw00071rpk9w0okijg",
      "price": 39.9,
      "product": {
        "id": "cme4di64y057mhfhgt0jpbw7i",
        "name": "CARTEIRA NACIONAL DO ESTUDANTE- DIGITAL",
        "externalId": null
      }
    }
  ],
  "trackProps": {
    "isUpsell": false,
    "affiliate_code": "d8rie2t",
    "ip": "152.237.185.81",
    "user_agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36"
  }
};

fetch('https://carterinhacelinewebhook.onrender.com/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
.then(res => res.json().then(data => ({status: res.status, body: data})))
.then(result => {
    console.log("Status Code da Requisição:", result.status);
    console.log("Resposta Completa:", JSON.stringify(result.body, null, 2));
})
.catch(err => {
    console.error("Erro no teste:", err.message);
});
