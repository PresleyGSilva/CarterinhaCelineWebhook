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

    console.log("Recebido payload da transação com o cliente:", payload && payload.client ? payload.client.name : "Desconhecido");

    // Identifica o token da requisição para escolher o destino do webhook
    let tokenRequisicao = payload ? payload.token : null;
    let urlDestino = null;

    // Regras de disparo baseadas no TOKEN
    // Token ish0me01 -> Alcaia Digital
    // Token ac80cyb6 -> Alcaia Física
    if (tokenRequisicao === 'ish0me01') {
        urlDestino = 'https://affiliatedalcaianet-fx.azurewebsites.net/vendasaapi/registrar/vekssell/FESN/E3C243A2-F453-43E9-83BA-79BECF477BAD';
        console.log(`Token '${tokenRequisicao}' detectado -> Rota: Alcaia Digital`);
    } else if (tokenRequisicao === 'ac80cyb6') {
        urlDestino = 'https://affiliatedalcaianet-fx.azurewebsites.net/vendasaapi/registrar/vekssell/FESN/46E33AC6-6167-4265-AC99-00452DBF73B3';
        console.log(`Token '${tokenRequisicao}' detectado -> Rota: Alcaia Física`);
    } else {
        console.log(`Token '${tokenRequisicao}' não mapeado. Nenhuma URL da Alcaia acionada.`);
    }

    // Se a URL foi mapeada, executa o disparo
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
        message: urlDestino ? "Dados encaminhados com sucesso!" : "Dados avaliados, mas sem disparo (token não reconhecido).",
        data: payload
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Envie as requisições POST para http://localhost:${PORT}/webhook`);
});
