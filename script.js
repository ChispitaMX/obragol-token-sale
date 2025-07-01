const DEST_WALLET = "8W2ogqdvFSvDFQitX2JyyiCX6hqeRZWrpWTkKYCHGPm";
const USDT_MINT = "Es9vMFrzaCERCFGK2F4zn6Lz3bZQkQqUGe9nU2hteY4"; // USDT SPL
let provider = null;

// Detectar billetera (Phantom o Solflare)
función getProvider() {
si (ventana.solana && ventana.solana.isPhantom) devuelve ventana.solana;
si (ventana.solflare) devuelve ventana.solflare;
alert("Instala Phantom o Solflare Wallet.");
devuelve nulo;
}

// Conectar billetera
función asíncrona connectWallet() {
proveedor = obtenerProveedor();
si (!proveedor) retorna;
intentar {
esperar proveedor.connect();
alert("Wallet conectada: " + provider.publicKey.toString());
} captura (e) {
alert("No se pudo conectar la billetera.");
}
}

// Calcula los tokens OBRAGOL a recibir
documento.getElementById("usdtInput").addEventListener("entrada", función () {
const usdt = parseFloat(este.valor);
const obracol = isNaN(usdt)? 0 : usdt * 500;
document.getElementById("obracolAmount").textContent = obracol;
});

// Enviar transacción USDT
async function buyTokens() {
  const provider = getProvider();
  if (!provider) return;

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));

  const usdtMint = new solanaWeb3.PublicKey(USDT_MINT);
  const destWallet = new solanaWeb3.PublicKey(DEST_WALLET);

  const wallet = provider.publicKey;
  const usdtAmount = parseFloat(document.getElementById("usdtAmount").value);
  if (isNaN(usdtAmount) || usdtAmount <= 0) {
    alert("Ingresa una cantidad válida de USDT.");
    return;
  }

  const usdtAmountInSmallestUnit = usdtAmount * 1e6;

  const fromTokenAccount = await splToken.getAssociatedTokenAddress(usdtMint, wallet);
  const toTokenAccount = await splToken.getAssociatedTokenAddress(usdtMint, destWallet);

  const transaction = new solanaWeb3.Transaction().add(
    splToken.createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      wallet,
      usdtAmountInSmallestUnit,
      [],
      splToken.TOKEN_PROGRAM_ID
    )
  );

  try {
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    alert("Compra exitosa. ID de transacción: " + signature);
  } catch (e) {
    console.error(e);
    alert("Error al enviar la transacción.");
  }
}
// Decimales del token USDT SPL = 6
cantidad constante = Math.floor(usdtAmount * 1e6);

 try { // Get token accounts const fromTokenAcc = await window.splToken.Token.getAssociatedTokenAddress( window.splToken.ASSOCIATED_TOKEN_PROGRAM_ID, window.splToken.TOKEN_PROGRAM_ID, new solanaWeb3.PublicKey(USDT_MINT), payer ); const toTokenAcc = await window.splToken.Token.getAssociatedTokenAddress( window.splToken.ASSOCIATED_TOKEN_PROGRAM_ID, window.splToken.TOKEN_PROGRAM_ID, new solanaWeb3.PublicKey(USDT_MINT), new solanaWeb3.PublicKey(DEST_WALLET) ); // Create transfer instruction const tx = new solanaWeb3.Transaction().add( window.splToken.Token.createTransferInstruction( window.splToken.TOKEN_PROGRAM_ID, fromTokenAcc, toTokenAcc, payer, [], amount ) ); tx.feePayer = payer; let { blockhash } = await conn.getLatestBlockhash(); tx.recentBlockhash = blockhash; // Sign & send let signed = await provider.signTransaction(tx); let txid = await conn.sendRawTransaction(signed.serialize()); alert("Pago enviado. TxID: " + txid + "\nPuedes verlo en Solscan.io"); // (Opcional) Aquí puedes registrar txid/compra en tu backend si necesitas. } catch (e) { alert("Error al enviar USDT: " + e.message); }
}

// Escuchadores de eventos
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("buyToken").onclick = comprarTokens;

// Lógica de cuenta regresiva (preventa hasta el 28-agosto-2025)
función startCountdown() {
const endDate = nueva fecha("2025-08-28T00:00:00Z").getTime();
intervalo constante = setInterval(función () {
const ahora = Fecha.ahora();
const diff = endDate - ahora;
si (diff <= 0) {
clearInterval(intervalo);
document.getElementById("countdown").textContent = "Preventa finalizada";
} demás {
const días = Math.floor(diff / (1000 * 60 * 60 * 24));
const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
const minutos = Math.floor((diff / (1000 * 60)) % 60);
const segundos = Math.floor((diff / 1000) % 60);
document.getElementById("cuenta regresiva").textContent =
días + "d " + horas + "h " + minutos + "m " + segundos + "s";
}
}, 1000);
}
iniciarCuentaRegresiva();
```
