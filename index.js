const express = require('express');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    let payload = req.body;

    // Verifica e corrige o address se vier nulo ou faltante
    if (payload && payload.client) {
        if (!payload.client.address) {
            payload.client.address = {
                "country": "BR",
                "zipCode": "",
                "state": "",
                "city": "",
                "neighborhood": "",
                "street": "",
                "number": "",
                "complement": ""
            };
        }
    }

    console.log(`Recebido payload. Cliente: ${payload && payload.client ? payload.client.name : "Desconhecido"}`);

    let tokenRequisicao = payload ? payload.token : null;
    let urlDestino = null;

    // A plataforma Veksell agora envia um token único (sashzu2i) para ambos.
    if (tokenRequisicao === 'sashzu2i') {
        
        // Como o token é o mesmo, a decisão de qual URL chamar será baseada no valor (preço)
        let valorRequisicao = 0;
        
        if (payload.transaction && typeof payload.transaction.amount === 'number') {
            valorRequisicao = payload.transaction.amount;
        } else if (payload.orderItems && payload.orderItems.length > 0) {
            valorRequisicao = payload.orderItems[0].price;
        }

        // Regras baseadas no valor
        // 35.90 ou 39.90 -> Alcaia Digital (baseado nas amostras de JSON)
        // 65.90 -> Alcaia Física
        if (valorRequisicao === 35.9 || valorRequisicao === 35.90 || valorRequisicao === 39.9 || valorRequisicao === 39.90) {
            urlDestino = 'https://affiliatedalcaianet-fx.azurewebsites.net/vendasaapi/registrar/vekssell/FESN/E3C243A2-F453-43E9-83BA-79BECF477BAD';
            console.log(`Token Veksell válido. Valor ${valorRequisicao} detectado -> Rota: Alcaia Digital`);
        } else if (valorRequisicao === 65.9 || valorRequisicao === 65.90) {
            urlDestino = 'https://affiliatedalcaianet-fx.azurewebsites.net/vendasaapi/registrar/vekssell/FESN/46E33AC6-6167-4265-AC99-00452DBF73B3';
            console.log(`Token Veksell válido. Valor ${valorRequisicao} detectado -> Rota: Alcaia Física`);
        } else {
            console.log(`Token Veksell válido, mas o valor (${valorRequisicao}) não mapeia para nenhuma URL da Alcaia.`);
        }
        
    } else {
        console.log(`Token '${tokenRequisicao}' inválido para a Vekssell. Nenhuma URL da Alcaia acionada.`);
    }

    // Se a URL foi mapeada com sucesso (token correto + valor correto), dispara
    if (urlDestino) {
        try {
            // Utilizando o "fetch" nativo do Node.js (Node 18+)
            const respostaDisparo = await fetch(urlDestino, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log(`✅ Webhook repassado com sucesso para a Alcaia! Status HTTP: ${respostaDisparo.status}`);
        } catch (erro) {
            console.error("❌ Erro ao enviar os dados para a URL da Alcaia:", erro.message);
        }
    }

    // Responde localmente dizendo que tratou o webhook com sucesso
    return res.status(200).json({
        message: urlDestino ? "Dados validados e encaminhados com sucesso!" : "Dados avaliados, mas sem disparo (token inválido ou valor não mapeado).",
        data: payload
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Envie as requisições POST para http://localhost:${PORT}/webhook`);
});
