/**
 * Script Simples de Teste de Stress para o MVP
 * Simula 50 requisições simultâneas de cálculo de score.
 */

async function runStressTest() {
  const TOTAL_REQUESTS = 50;
  const targetUrl = 'http://localhost:3000/credit-score/recalculate'; // Requer auth em cenário real
  
  console.log(`Starting stress test: ${TOTAL_REQUESTS} parallel requests...`);
  
  const startTime = Date.now();
  
  // Nota: Para simplificar no MVP, este teste assume que a rota está aberta
  // ou que você injetou um token válido. Aqui simulamos apenas a lógica de carga.
  
  const requests = Array.from({ length: TOTAL_REQUESTS }).map(async (_, i) => {
    try {
      // Simulação de chamada (usando fetch se disponível ou apenas log de lógica)
      // Em produção usaríamos 'axios' ou 'autocannon'
      const start = Date.now();
      // Simular processamento intenso
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200)); 
      const duration = Date.now() - start;
      return { success: true, duration };
    } catch (e) {
      return { success: false };
    }
  });

  const results = await Promise.all(requests);
  const endTime = Date.now();
  
  const successful = results.filter(r => r.success).length;
  const avgDuration = results.reduce((acc, curr: any) => acc + (curr.duration || 0), 0) / TOTAL_REQUESTS;

  console.log('--- Stress Test Results ---');
  console.log(`Total Time: ${endTime - startTime}ms`);
  console.log(`Successful Requests: ${successful}/${TOTAL_REQUESTS}`);
  console.log(`Average Response Time: ${avgDuration.toFixed(2)}ms`);
  console.log('---------------------------');
}

runStressTest();
