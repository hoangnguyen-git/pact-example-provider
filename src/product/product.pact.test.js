require('dotenv').config();
const { Verifier } = require('@pact-foundation/pact');
const {
  baseOpts,
  setupServer,
  stateHandlers,
  requestFilter
} = require('./pact.setup');

describe('Pact Verification', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
  });
  afterAll(() => {
    if (server) {
      server.close();
    }
  });
  it('validates the expectations of a contract required verification that has been published for this provider', () => {
    // For builds trigged by a 'contract_requiring_verification_published' webhook, verify the changed pact against latest of mainBranch and any version currently deployed to an environment
    // https://docs.pact.io/pact_broker/webhooks#using-webhooks-with-the-contract_requiring_verification_published-event
    // The URL will bave been passed in from the webhook to the CI job.

    // if (!process.env.PACT_URL) {
    //   console.log('no pact url specified');
    //   return;
    // }
    const pactChangedOpts = {
      pactUrls: [process.env.PACT_URL]
    }

    const fetchPactsDynamicallyOpts = {
      provider: "pactflow-example-provider",
      //consumerVersionTag: ['master', 'prod'], //the old way of specifying which pacts to verify
      consumerVersionSelectors: [{ tag: 'master', latest: true }, { tag: 'prod', latest: true } ], // the new way of specifying which pacts to verify
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      enablePending: false,
      publishVerificationResult: true,
    }

    const opts = {
      ...baseOpts,
      ...(process.env.PACT_URL ? pactChangedOpts : fetchPactsDynamicallyOpts),
      stateHandlers: stateHandlers,
      requestFilter: requestFilter
    };


    return new Verifier(opts).verifyProvider().then(() => {
      console.log('Pact Verification Complete!');
    });
  });
});



// require('dotenv').config();
// const { Verifier } = require('@pact-foundation/pact');
// const {
//   baseOpts,
//   setupServer,
//   stateHandlers,
//   requestFilter
// } = require('./pact.setup');

// describe('Pact Verification', () => {
//   let server;
//   beforeAll(() => {
//     server = setupServer();
//   });
//   afterAll(() => {
//     if (server) {
//       server.close();
//     }
//   });
//   it('validates the expectations of a contract required verification that has been published for this provider', () => {
//     // For builds trigged by a 'contract_requiring_verification_published' webhook, verify the changed pact against latest of mainBranch and any version currently deployed to an environment
//     // https://docs.pact.io/pact_broker/webhooks#using-webhooks-with-the-contract_requiring_verification_published-event
//     // The URL will bave been passed in from the webhook to the CI job.

//     // if (!process.env.PACT_URL) {
//     //   console.log('no pact url specified');
//     //   return;
//     // }

//     // const opts = {
//     //   ...baseOpts,
//     //   // pactUrls: [process.env.PACT_URL] | 'http://localhost:9080/',
//     //   pactUrls: ['http://localhost:9080/'],
//     //   providerVersion: '1.0.0',
//     //   stateHandlers: stateHandlers,
//     //   requestFilter: requestFilter
//     // };

//     const opts = {
//       providerBaseUrl: 'http://localhost:8080',
//       provider: 'pactflow-example-provider',
//       pactBrokerUrl: 'http://localhost:9080/',
//       consumerVersionTags: ["dev"],
//       providerVersionTags: ["dev"],
//       providerVersion: '1.0.0', // Replace this with your actual provider version
//       publishVerificationResult: true,
//       logLevel: "DEBUG"
//     };

//     return new Verifier(opts).verifyProvider().then(() => {
//       console.log('Pact Verification Complete!');
//     });
//   });
// });
