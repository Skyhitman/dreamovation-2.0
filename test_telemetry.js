const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws/telemetry?role=learner');

ws.on('open', () => {
  console.log('[Test WS] Connected to SkillSafe VR Telemetry Stream');
  
  // Send simulated VR interaction event
  const testEvent = {
    objectId: 'breaker_b3_main',
    action: 'LOTO_PADLOCK_APPLIED',
    sequenceStep: 3,
    outcome: 'SUCCESS',
    detail: 'OSHA standard 1910.147 physical padlock shackle engaged',
    learnerId: 'NSDC-VR-84920',
    moduleId: 'elec'
  };

  ws.send(JSON.stringify(testEvent));
  console.log('[Test WS] Emitted test telemetry event:', testEvent.action);

  setTimeout(() => {
    ws.close();
    console.log('[Test WS] Test finished successfully.');
    process.exit(0);
  }, 1000);
});

ws.on('error', (err) => {
  console.error('[Test WS Error]:', err.message);
  process.exit(1);
});
