
const DESTINATION_WALLET = "8W2ogqdvFSvDfQitX2JyyiCX6hqehZWvrpWTkkYCHGPm";
const USDT_MINT = "Es9vMFrzaCERCFGK2F4zn6Lz3bZQkQqUGe9nU2hteY4"; // SPL USDT en mainnet

// Conexión a Phantom
async function connectPhantom() {
  const provider = window.solana;
  if (!provider || !provider.isPhantom) {
    alert("Instala la Phantom Wallet");
    return null;
  }
  try {
    const resp = await provider.connect();
    return resp.publicKey.toString();
  } catch (e) {
    alert("No se pudo conectar con la wallet: " + e.message);
    return null;
  }
}

// Transferencia real de USDT SPL
async function sendUSDT(amount) {
  const provider = window.solana;
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");
  const fromWallet = provider.publicKey;
  const toWallet = new solanaWeb3.PublicKey(DESTINATION_WALLET);

  const fromTokenAccount = await splToken.getAssociatedTokenAddress(
    new solanaWeb3.PublicKey(USDT_MINT), fromWallet
  );
  const toTokenAccount = await splToken.getAssociatedTokenAddress(
    new solanaWeb3.PublicKey(USDT_MINT), toWallet
  );

  const transaction = new solanaWeb3.Transaction().add(
    splToken.createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromWallet,
      Number(amount) * 1e6 // USDT tiene 6 decimales
    )
  );
  transaction.feePayer = fromWallet;
  let blockhashObj = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhashObj.blockhash;

  const signed = await provider.signTransaction(transaction);
  const txId = await connection.sendRawTransaction(signed.serialize());
  alert("Transferencia enviada! TxID: " + txId);
}

// Eventos de botones
document.getElementById("connectWallet").onclick = async function () {
  const address = await connectPhantom();
  if(address){
    alert("Wallet conectada: " + address);
  }
};

document.getElementById("buyBtn").onclick = async function () {
  const usdtAmount = document.getElementById("usdtInput").value;
  await sendUSDT(usdtAmount);
};

// Contador y cálculo de tokens
const usdtInput = document.getElementById("usdtInput");
const obracolAmount = document.getElementById("obracolAmount");
const TOKEN_PRICE = 0.002;
usdtInput.addEventListener("input", () => {
  const usdt = parseFloat(usdtInput.value);
  if (!isNaN(usdt)) {
    const tokens = usdt / TOKEN_PRICE;
    obracolAmount.innerText = tokens.toFixed(0);
  } else {
    obracolAmount.innerText = "0";
  }
});

// Temporizador
function startCountdown() {
  const countdown = document.getElementById("countdown");
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 60);
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDate.getTime() - now;
    if (distance <= 0) {
      countdown.innerText = "Preventa finalizada";
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdown.innerText = `Tiempo restante: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  setInterval(updateCountdown, 1000);
}
startCountdown();
